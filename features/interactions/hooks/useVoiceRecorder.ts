"use client"

import { useEffect, useRef, useState, useCallback } from "react"

type SpeechRecognitionCtor = new () => SpeechRecognition

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onend: (() => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onstart: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
}

export function useVoiceRecorder(initialValue: string = "") {
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const isListeningRef = useRef(false)      // source of truth for restart logic
  const finalTranscriptRef = useRef(initialValue)     // accumulates all confirmed speech
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState(initialValue)
  const [error, setError] = useState<string | null>(null)

  const createRecognition = useCallback(() => {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!Recognition) return null

    const recognition = new Recognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onstart = () => {
      setListening(true)
      setError(null)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ""

      // Process only new results from resultIndex onwards
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscriptRef.current += result[0]?.transcript ?? ""
        } else {
          interim += result[0]?.transcript ?? ""
        }
      }

      // Show final + current interim
      setTranscript(finalTranscriptRef.current + (interim ? " " + interim : ""))
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // "no-speech" and "network" can happen normally (e.g. temporary dropout) — just let it restart
      if (event.error === "no-speech") return
      if (event.error === "network") return
      if (event.error === "aborted") return

      setError(event.error === "not-allowed"
        ? "Microphone permission denied. Please allow microphone access in your browser settings."
        : `Recording error: ${event.error}`)
      isListeningRef.current = false
      setListening(false)
    }

    recognition.onend = () => {
      // Auto-restart if we're still supposed to be listening
      // (SpeechRecognition stops after ~60s silence or on mobile after pause)
      if (isListeningRef.current) {
        restartTimerRef.current = setTimeout(() => {
          if (isListeningRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start()
            } catch {
              // Might already be running — ignore
            }
          }
        }, 200)
      } else {
        setListening(false)
      }
    }

    return recognition
  }, [])

  useEffect(() => {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (Recognition) {
      setSupported(true)
      recognitionRef.current = createRecognition()
    }

    return () => {
      isListeningRef.current = false
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current)
      recognitionRef.current?.abort()
    }
  }, [createRecognition])

  function start() {
    if (!recognitionRef.current) return
    setError(null)
    // We do NOT clear finalTranscriptRef here because we might want to append to existing text.
    // However, if the user hits "start" again, we typically want to append to what's already there,
    // or maybe they want to clear it? Appending is safer.
    isListeningRef.current = true

    // Re-create instance to avoid "already started" errors
    recognitionRef.current = createRecognition()
    try {
      recognitionRef.current?.start()
    } catch {
      // Ignore if already started
    }
  }

  function stop() {
    isListeningRef.current = false
    if (restartTimerRef.current) clearTimeout(restartTimerRef.current)
    recognitionRef.current?.stop()
    setListening(false)
  }

  function setTranscriptManual(value: string) {
    finalTranscriptRef.current = value
    setTranscript(value)
  }

  return {
    supported,
    listening,
    transcript,
    setTranscript: setTranscriptManual,
    start,
    stop,
    error,
  }
}
