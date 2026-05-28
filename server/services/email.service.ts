import nodemailer from "nodemailer"
import { buildNudgeDigestHtml } from "@/server/emails/nudge-digest.html"
import { buildWeeklyReportHtml } from "@/server/emails/weekly-report.html"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD?.replace(/ /g, ""), // Remove spaces if present
  },
})

const FROM = process.env.GMAIL_USER ? `"BondIQ" <${process.env.GMAIL_USER}>` : '"BondIQ" <bondiq.admin@gmail.com>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://bondiq-liard.vercel.app"

export interface NudgeForEmail {
  personName: string
  reason: string
  draftMessage?: string | null
}

export interface WeeklyDigestForEmail {
  weekLabel: string
  invested: { person: string; type: string }[]
  fading: { name: string; days: number }[]
  upcoming: { person: string; title: string; date: string | null }[]
  recommendation: string
  recommendationReason: string
}

export const EmailService = {
  /**
   * Send the daily nudge digest to a user.
   * Only sends if there are nudges to report.
   */
  async sendNudgeDigest(to: string, userName: string, nudges: NudgeForEmail[]): Promise<void> {
    if (!nudges.length) return
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn("[EmailService] GMAIL credentials not set — skipping email")
      return
    }

    const html = buildNudgeDigestHtml({ userName, nudges, appUrl: APP_URL })

    try {
      await transporter.sendMail({
        from: FROM,
        to,
        subject: `🔔 You have ${nudges.length} relationship nudge${nudges.length !== 1 ? "s" : ""} today`,
        html,
      })
      console.log(`[EmailService] Nudge digest sent to ${to}`)
    } catch (err) {
      console.error("[EmailService] sendNudgeDigest exception:", err)
    }
  },

  /**
   * Send the weekly relationship report email every Monday.
   */
  async sendWeeklyReport(to: string, userName: string, digest: WeeklyDigestForEmail): Promise<void> {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn("[EmailService] GMAIL credentials not set — skipping email")
      return
    }

    const html = buildWeeklyReportHtml({
      userName,
      weekLabel: digest.weekLabel,
      invested: digest.invested,
      fading: digest.fading,
      upcoming: digest.upcoming,
      recommendation: digest.recommendation,
      recommendationReason: digest.recommendationReason,
      appUrl: APP_URL,
    })

    try {
      await transporter.sendMail({
        from: FROM,
        to,
        subject: `📊 Your Weekly Relationship Report — ${digest.weekLabel}`,
        html,
      })
      console.log(`[EmailService] Weekly report sent to ${to}`)
    } catch (err) {
      console.error("[EmailService] sendWeeklyReport exception:", err)
    }
  },

  /**
   * Send an inactivity alert when user hasn't logged in for 7+ days.
   */
  async sendInactivityAlert(
    to: string,
    userName: string,
    fadingPeople: { name: string; days: number }[]
  ): Promise<void> {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return
    const greeting = userName ? userName.split(" ")[0] : "there"
    const fadingList = fadingPeople
      .slice(0, 3)
      .map((p) => `<li style="padding:4px 0;"><strong>${p.name}</strong> — last contact ${p.days} days ago</li>`)
      .join("")

    const html = `<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;background:#f0f0f0;padding:32px;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border:4px solid #000;padding:32px;">
    <div style="background:#000;color:#ccff00;padding:12px 20px;margin:-32px -32px 24px -32px;font-weight:900;font-size:20px;text-transform:uppercase;letter-spacing:0.1em;">
      ♥ BONDIQ
    </div>
    <h1 style="font-size:22px;font-weight:900;color:#000;text-transform:uppercase;margin:0 0 12px 0;">
      Hey ${greeting}, don't let your relationships fade 👋
    </h1>
    <p style="font-size:14px;color:#555;margin:0 0 20px 0;">
      You haven't logged into BondIQ in a while. Here's what's been happening while you were away:
    </p>
    ${fadingList ? `<ul style="margin:0 0 20px 0;padding-left:20px;">${fadingList}</ul>` : ""}
    <a href="${APP_URL}/dashboard" style="display:inline-block;background:#ccff00;color:#000;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;padding:12px 28px;text-decoration:none;border:3px solid #000;">
      CATCH UP NOW →
    </a>
    <p style="font-size:11px;color:#aaa;margin-top:24px;font-family:monospace;text-transform:uppercase;">
      <a href="${APP_URL}/settings" style="color:#ccff00;">Manage email preferences</a>
    </p>
  </div>
</body></html>`

    try {
      await transporter.sendMail({
        from: FROM,
        to,
        subject: `👋 Hey ${greeting}, your relationships miss you`,
        html,
      })
      console.log(`[EmailService] Inactivity alert sent to ${to}`)
    } catch (err) {
      console.error("[EmailService] sendInactivityAlert exception:", err)
    }
  },
}
