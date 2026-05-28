import { NextResponse } from "next/server"
import { getServerSession } from "@/server/lib/auth"
import { EmailService } from "@/server/services/email.service"

/**
 * POST /api/email/test
 * Body: { type: "nudge" | "weekly" | "inactivity" }
 * Sends a test email to the logged-in user's email address.
 */
export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  const userEmail = session.user.email
  const userName = session.user.name ?? ""

  const { type = "nudge" } = await req.json().catch(() => ({}))

  if (type === "nudge") {
    await EmailService.sendNudgeDigest(userEmail, userName || "Friend", [
      {
        personName: "Sarah Jenkins",
        reason: "It has been exactly 30 days since you last contacted Sarah.",
        draftMessage: "Hey Sarah! It's been a while — hope you're doing well! Would love to catch up soon. ☕",
      },
      {
        personName: "Arjun Mehta",
        reason: "Arjun's relationship health dropped below 60.",
        draftMessage: null,
      },
      {
        personName: "Mom",
        reason: "Mom's birthday is coming up in 5 days!",
        draftMessage: "Happy early birthday, Mom! 🎂 Thinking of you!",
      },
    ])
  } else if (type === "weekly") {
    await EmailService.sendWeeklyReport(userEmail, userName || "Friend", {
      weekLabel: "May 26 – Jun 1, 2025",
      invested: [
        { person: "Sarah Jenkins", type: "text_log" },
        { person: "Arjun Mehta", type: "voice_log" },
      ],
      fading: [
        { name: "Rohit Sharma", days: 45 },
        { name: "Priya Singh", days: 32 },
      ],
      upcoming: [
        { person: "Mom", title: "Birthday", date: new Date(Date.now() + 3 * 86400000).toISOString() },
      ],
      recommendation: "Rohit Sharma",
      recommendationReason: "Rohit has the lowest health score and you haven't spoken in 45 days.",
    })
  } else if (type === "inactivity") {
    await EmailService.sendInactivityAlert(userEmail, userName || "Friend", [
      { name: "Sarah Jenkins", days: 22 },
      { name: "Arjun Mehta", days: 18 },
    ])
  } else {
    return NextResponse.json({ error: "Invalid type. Use: nudge | weekly | inactivity" }, { status: 400 })
  }

  return NextResponse.json({ ok: true, sentTo: userEmail, type })
}
