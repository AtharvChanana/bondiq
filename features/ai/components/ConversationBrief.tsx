"use client"

import { useConversationBrief } from "@/features/ai/hooks/useConversationBrief"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"

export function ConversationBrief({ personId }: { personId: string }) {
  const { brief, loading, generate } = useConversationBrief(personId)

  return (
    <div className="space-y-3">
      <Button onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Generate brief"}
      </Button>
      {brief ? (
        <Card className="rounded-none">
          <CardContent>
            <pre className="whitespace-pre-wrap font-sans text-sm">{brief}</pre>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
