"use client"

import { Textarea } from "@/shared/components/ui/textarea"

interface TextLoggerProps {
  value: string
  onChange: (value: string) => void
}

export function TextLogger({ value, onChange }: TextLoggerProps) {
  return (
    <Textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-40"
      placeholder="Called Arjun today. He got rejected from the Bangalore job but seems okay about it..."
    />
  )
}
