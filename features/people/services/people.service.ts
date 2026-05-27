import type { CreatePersonInput, Person, PersonDetail, UpdatePersonInput } from "../types"

const BASE = "/api/people"

async function parseResponse<T>(res: Response, message: string): Promise<T> {
  if (!res.ok) {
    let errText = message
    try {
      const data = await res.json()
      if (data.error) errText = typeof data.error === 'string' ? data.error : JSON.stringify(data.error)
    } catch {}
    throw new Error(errText)
  }
  return res.json()
}

export const PeopleClientService = {
  async getAll(): Promise<Person[]> {
    return parseResponse(await fetch(BASE), "Failed to fetch people")
  },

  async getById(id: string): Promise<PersonDetail> {
    return parseResponse(await fetch(`${BASE}/${id}`), "Failed to fetch person")
  },

  async create(data: CreatePersonInput): Promise<Person> {
    return parseResponse(
      await fetch(BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
      "Failed to create person"
    )
  },

  async update(id: string, data: UpdatePersonInput): Promise<Person> {
    return parseResponse(
      await fetch(`${BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
      "Failed to update person"
    )
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${BASE}/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Failed to delete person")
  },
}
