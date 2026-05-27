"use client"

import { Users } from "lucide-react"
import { AddPersonModal } from "@/features/people/components/AddPersonModal"
import { PersonGrid } from "@/features/people/components/PersonGrid"
import { usePeople } from "@/features/people/hooks/usePeople"
import { EmptyState } from "@/shared/components/EmptyState"
import { LoadingSpinner } from "@/shared/components/LoadingSpinner"
import { PageHeader } from "@/shared/components/PageHeader"
import { RELATIONSHIP_TYPES } from "@/shared/constants/relationship-types"

export function PeoplePage() {
  const { filteredPeople, loading, error, query, relationship, setQuery, setRelationship, addPerson } = usePeople()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <PageHeader
        title="People"
        description={`${filteredPeople.length} connections tracked`}
        actions={<AddPersonModal onAdd={addPerson} />}
      />

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH BY NAME, LOCATION, OR TAGS..."
            style={{
              width: '100%',
              background: '#FFFFFF',
              color: '#000000',
              border: '4px solid #000000',
              borderRadius: 0,
              fontFamily: "var(--font-space-mono, 'Space Mono', monospace)",
              fontSize: '12px',
              padding: '10px 14px',
              outline: 'none',
            }}
          />
        </div>
        <select
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
          style={{
            background: '#FFFFFF',
            color: '#000000',
            border: '4px solid #000000',
            borderRadius: 0,
            fontFamily: "var(--font-space-mono, 'Space Mono', monospace)",
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            padding: '10px 14px',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="all">ALL TYPES</option>
          {RELATIONSHIP_TYPES.map((type) => (
            <option key={type} value={type}>{type.toUpperCase()}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '256px' }}>
          <LoadingSpinner />
        </div>
      ) : error ? (
        <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", color: '#FF3B3B', fontSize: '12px', textTransform: 'uppercase' }}>{error}</p>
      ) : filteredPeople.length ? (
        <PersonGrid people={filteredPeople} />
      ) : (
        <div style={{ border: '4px solid #333333', padding: '64px 32px', textAlign: 'center' }}>
          <div style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '64px', color: '#FFFFFF', lineHeight: 0.9, marginBottom: '16px' }}>EMPTY.</div>
          <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '11px', color: '#666666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px' }}>
            ADD YOUR FIRST PERSON TO START TRACKING RELATIONSHIPS
          </p>
          <AddPersonModal onAdd={addPerson} />
        </div>
      )}
    </div>
  )
}
