import { PersonCard } from "@/features/people/components/PersonCard"
import type { Person } from "@/features/people/types"

export function PersonGrid({ people }: { people: Person[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {people.map((person) => (
        <PersonCard key={person.id} person={person} />
      ))}
    </div>
  )
}
