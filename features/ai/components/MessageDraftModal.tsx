"use client"

import { useState } from "react"
import { toast } from "sonner"

import { useMessageDraft } from "@/features/ai/hooks/useMessageDraft"
import type { MessageOccasion } from "@/features/ai/types"
import { Button, buttonVariants } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Textarea } from "@/shared/components/ui/textarea"
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard"

const occasions: MessageOccasion[] = [
  "checking_in",
  "birthday",
  "following_up",
  "congratulating",
  "just_because",
]

export function MessageDraftModal({ personId }: { personId: string }) {
  const { copy } = useCopyToClipboard()
  const { draft, setDraft, loading, generate } = useMessageDraft(personId)
  const [occasion, setOccasion] = useState<MessageOccasion>("checking_in")

  async function handleGenerate() {
    try {
      await generate(occasion)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not draft message")
    }
  }

  return (
    <Dialog>
      <DialogTrigger className={buttonVariants()}>Draft a message</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Draft a message</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <select
            className="h-9 w-full rounded-none border bg-background px-3 text-sm"
            value={occasion}
            onChange={(event) => setOccasion(event.target.value as MessageOccasion)}
          >
            {occasions.map((item) => (
              <option key={item} value={item}>
                {item.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? "Drafting..." : "Generate"}
          </Button>
          {draft ? (
            <div className="space-y-3">
              <Textarea
                value={draft.message}
                onChange={(event) => setDraft({ ...draft, message: event.target.value })}
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => copy(draft.message)}>
                  Copy
                </Button>
                <Button variant="outline" onClick={() => window.open(draft.whatsappUrl)}>
                  Open WhatsApp
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
