"use client"

import { CalendarPlus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { MilestonesClientService } from "@/features/people/services/milestones.service"
import { Button, buttonVariants } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"

interface AddMilestoneModalProps {
  personId: string
  onCreated: () => Promise<void>
}

export function AddMilestoneModal({ personId, onCreated }: AddMilestoneModalProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    try {
      await MilestonesClientService.create({
        personId,
        title,
        date: date ? new Date(`${date}T00:00:00.000Z`).toISOString() : null,
        isRecurring,
      })
      await onCreated()
      setTitle("")
      setDate("")
      setIsRecurring(false)
      setOpen(false)
      toast.success("Milestone added")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add milestone")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ variant: "outline", size: "sm" })}>
        <CalendarPlus className="size-4" />
        Add milestone
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add milestone</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(event) => setIsRecurring(event.target.checked)}
            />
            Repeats every year
          </label>
          <Button disabled={loading || !title.trim()} className="w-full">
            Save milestone
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
