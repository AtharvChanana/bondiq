"use client"

import { Check, Copy, X } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard"

interface NudgeActionsProps {
  message?: string | null
  onActed: () => void
  onDismiss: () => void
}

export function NudgeActions({ message, onActed, onDismiss }: NudgeActionsProps) {
  const { copied, copy } = useCopyToClipboard()

  return (
    <div className="flex flex-wrap gap-2">
      {message ? (
        <Button variant="outline" onClick={() => copy(message)}>
          <Copy className="size-4" />
          {copied ? "Copied" : "Copy"}
        </Button>
      ) : null}
      <Button variant="outline" onClick={onActed}>
        <Check className="size-4" />
        Acted
      </Button>
      <Button variant="ghost" onClick={onDismiss}>
        <X className="size-4" />
        Dismiss
      </Button>
    </div>
  )
}
