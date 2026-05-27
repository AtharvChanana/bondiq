import { Badge } from "@/shared/components/ui/badge"

export function ExtractionStatus({ status }: { status: string }) {
  if (status === "completed") return <Badge className="bg-emerald-100 text-emerald-800">AI done</Badge>
  if (status === "failed") return <Badge className="bg-red-100 text-red-800">AI failed</Badge>
  return <Badge className="bg-amber-100 text-amber-800">AI processing</Badge>
}
