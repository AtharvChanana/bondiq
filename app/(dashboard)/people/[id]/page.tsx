import { PersonProfilePage } from "@/features/people"

export default function Page({ params }: { params: { id: string } }) {
  return <PersonProfilePage personId={params.id} />
}
