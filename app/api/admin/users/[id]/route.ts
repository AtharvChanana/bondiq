import { NextResponse } from "next/server"
import { getServerSession } from "@/server/lib/auth"
import { prisma } from "@/server/lib/prisma"

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()
    
    // Strict admin check
    if (session?.user?.email !== "bondiq.admin@gmail.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete the user. Supabase cascading rules will delete all associated data
    // (people, interactions, milestones, nudges, memories) automatically.
    await prisma.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[admin/deleteUser] Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
