"use client"

import { useState } from "react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

interface AdminUserRowProps {
  user: {
    id: string
    email: string
    name: string | null
    createdAt: Date
    _count: {
      people: number
      interactions: number
    }
  }
}

export function AdminUserRow({ user }: AdminUserRowProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm(`WARNING: Are you absolutely sure you want to delete ${user.email}?\n\nThis will permanently erase all their contacts, interactions, nudges, and account data.`)) {
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete user")
      router.refresh()
    } catch (err) {
      console.error(err)
      alert("Failed to delete user. Check console.")
      setIsDeleting(false)
    }
  }

  return (
    <tr className="border-b-2 border-gray-200 last:border-0 hover:bg-[#CCFF00] transition-colors duration-0">
      <td className="p-3 border-r-2 border-black truncate max-w-[200px]">{user.email}</td>
      <td className="p-3 border-r-2 border-black truncate max-w-[150px]">{user.name ?? "-"}</td>
      <td className="p-3 border-r-2 border-black whitespace-nowrap">{format(new Date(user.createdAt), "MMM d, yyyy")}</td>
      <td className="p-3 border-r-2 border-black font-bold">{user._count.people}</td>
      <td className="p-3 border-r-2 border-black font-bold">{user._count.interactions}</td>
      <td className="p-3 text-center">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-500 text-white font-black text-xs px-3 py-1 border-2 border-black uppercase hover:bg-red-600 disabled:opacity-50"
        >
          {isDeleting ? "DELETING..." : "DELETE"}
        </button>
      </td>
    </tr>
  )
}
