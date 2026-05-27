"use client"

import { Mic, Square, AlertCircle } from "lucide-react"
import { useEffect } from "react"

import { useVoiceRecorder } from "@/features/interactions/hooks/useVoiceRecorder"
import { Button } from "@/shared/components/ui/button"
import { Textarea } from "@/shared/components/ui/textarea"

interface VoiceLoggerProps {
  value: string
  onTranscriptChange: (value: string) => void
}

export function VoiceLogger({ value, onTranscriptChange }: VoiceLoggerProps) {
  const { supported, listening, transcript, setTranscript, start, stop, error } = useVoiceRecorder(value)

  useEffect(() => {
    onTranscriptChange(transcript)
  }, [onTranscriptChange, transcript])

  function update(value: string) {
    setTranscript(value)
    onTranscriptChange(value)
  }

  if (!supported) {
    return (
      <div className="rounded-none border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
        <AlertCircle className="size-4 flex-shrink-0 mt-0.5" />
        <span>
          Voice recording is not supported in this browser. Use Chrome or Edge for best results, or switch to text logging.
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Record / Stop controls */}
      <div className="flex items-center gap-3">
        {!listening ? (
          <Button
            type="button"
            onClick={start}
            className="bg-black text-white border-2 border-black text-white rounded-none h-10 px-5 font-semibold flex items-center gap-2 shadow-md shadow-none"
          >
            <Mic className="size-4" />
            Start Recording
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={stop}
            className="border-red-500/50 text-red-600 hover:bg-red-500/10 rounded-none h-10 px-5 font-semibold flex items-center gap-2"
          >
            <Square className="size-4 fill-red-500 text-red-500" />
            Stop Recording
          </Button>
        )}

        {/* Live indicator */}
        {listening && (
          <div className="flex items-center gap-2 animate-in fade-in duration-200">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <span className="text-sm font-semibold text-red-500">Recording…</span>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-none border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300 flex items-start gap-2 animate-in fade-in duration-150">
          <AlertCircle className="size-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Transcript */}
      <div className="relative">
        <Textarea
          value={transcript}
          onChange={(event) => update(event.target.value)}
          onBlur={() => onTranscriptChange(transcript)}
          className="min-h-40 rounded-none border-border/60 bg-background/60 focus:ring-2 focus:ring-primary/30 text-sm font-medium leading-relaxed pr-16"
          placeholder={listening ? "Speak now — transcript appears here in real time…" : "Your transcript appears here. You can also type or paste text."}
        />
        {transcript && (
          <span className="absolute bottom-3 right-3 text-[11px] text-muted-foreground font-medium">
            {transcript.split(/\s+/).filter(Boolean).length} words
          </span>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground">
        {listening
          ? "Recording is active. Speak clearly — it will keep going until you stop."
          : "Click 'Start Recording' and speak. Recording stays active until you stop it."}
      </p>
    </div>
  )
}
