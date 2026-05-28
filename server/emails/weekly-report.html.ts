interface FadingPerson {
  name: string
  days: number
}

interface InvestedPerson {
  person: string
  type: string
}

interface UpcomingEvent {
  person: string
  title: string
  date: string | null
}

interface WeeklyReportEmailProps {
  userName: string
  weekLabel: string
  invested: InvestedPerson[]
  fading: FadingPerson[]
  upcoming: UpcomingEvent[]
  recommendation: string
  recommendationReason: string
  appUrl: string
}

export function buildWeeklyReportHtml({
  userName,
  weekLabel,
  invested,
  fading,
  upcoming,
  recommendation,
  recommendationReason,
  appUrl,
}: WeeklyReportEmailProps): string {
  const greeting = userName ? userName.split(" ")[0] : "there"

  const investedSection =
    invested.length > 0
      ? invested
          .map(
            (i) =>
              `<li style="padding:6px 0;font-family:Arial,sans-serif;font-size:14px;color:#111111;border-bottom:1px solid #eeeeee;">
          <strong>${i.person}</strong>
          <span style="font-family:monospace;font-size:10px;color:#888888;text-transform:uppercase;margin-left:8px;">${i.type.replace("_", " ")}</span>
        </li>`
          )
          .join("")
      : `<li style="padding:6px 0;font-family:Arial,sans-serif;font-size:14px;color:#888888;font-style:italic;">No interactions logged this week.</li>`

  const fadingSection =
    fading.length > 0
      ? fading
          .slice(0, 5)
          .map(
            (p) =>
              `<div style="display:flex;justify-content:space-between;padding:8px 12px;background:#fff5f5;border-left:3px solid #ff4444;margin-bottom:6px;">
          <span style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#111111;">${p.name}</span>
          <span style="font-family:monospace;font-size:11px;color:#cc0000;font-weight:700;">${p.days}d ago</span>
        </div>`
          )
          .join("")
      : `<p style="font-family:Arial,sans-serif;font-size:14px;color:#22aa44;font-weight:600;margin:0;">✅ No fading relationships this week!</p>`

  const upcomingSection =
    upcoming.length > 0
      ? upcoming
          .map(
            (e) =>
              `<div style="padding:10px 14px;background:#f7fff0;border-left:3px solid #ccff00;margin-bottom:6px;">
          <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#111111;">${e.title}</p>
          <p style="margin:4px 0 0 0;font-family:monospace;font-size:11px;color:#555555;text-transform:uppercase;">${e.person} • ${e.date ? new Date(e.date).toDateString() : "Date TBD"}</p>
        </div>`
          )
          .join("")
      : `<p style="font-family:Arial,sans-serif;font-size:14px;color:#888888;font-style:italic;margin:0;">No upcoming events this week.</p>`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BondIQ — Your Weekly Relationship Report</title>
</head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#000000;padding:28px 32px;border-bottom:4px solid #ccff00;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-family:Arial,sans-serif;font-size:22px;font-weight:900;color:#ffffff;text-transform:uppercase;letter-spacing:0.1em;">
                      ♥ BONDIQ
                    </span><br/>
                    <span style="font-family:monospace;font-size:11px;color:#ccff00;text-transform:uppercase;letter-spacing:0.1em;">
                      Weekly Relationship Report
                    </span>
                  </td>
                  <td align="right" style="vertical-align:top;">
                    <span style="background:#ccff00;color:#000000;font-family:monospace;font-size:10px;font-weight:700;text-transform:uppercase;padding:4px 10px;letter-spacing:0.1em;">
                      ${weekLabel}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:32px;border:4px solid #000000;border-top:none;">

              <h1 style="font-family:Arial,sans-serif;font-size:24px;font-weight:900;color:#000000;text-transform:uppercase;margin:0 0 6px 0;">
                Your Week in Review, ${greeting}
              </h1>
              <p style="font-family:Arial,sans-serif;font-size:14px;color:#666666;margin:0 0 28px 0;">
                Here's a snapshot of how your relationships are doing this week.
              </p>

              <!-- Section: Invested -->
              <h2 style="font-family:monospace;font-size:12px;font-weight:700;text-transform:uppercase;color:#000000;letter-spacing:0.1em;border-bottom:3px solid #000000;padding-bottom:8px;margin:0 0 12px 0;">
                📲 Connected This Week
              </h2>
              <ul style="list-style:none;margin:0 0 24px 0;padding:0;">
                ${investedSection}
              </ul>

              <!-- Section: Fading -->
              <h2 style="font-family:monospace;font-size:12px;font-weight:700;text-transform:uppercase;color:#cc0000;letter-spacing:0.1em;border-bottom:3px solid #cc0000;padding-bottom:8px;margin:0 0 12px 0;">
                ⚠️ Relationships Fading
              </h2>
              <div style="margin-bottom:24px;">
                ${fadingSection}
              </div>

              <!-- Section: Upcoming -->
              <h2 style="font-family:monospace;font-size:12px;font-weight:700;text-transform:uppercase;color:#000000;letter-spacing:0.1em;border-bottom:3px solid #ccff00;padding-bottom:8px;margin:0 0 12px 0;">
                📅 Upcoming This Week
              </h2>
              <div style="margin-bottom:24px;">
                ${upcomingSection}
              </div>

              <!-- Section: Recommendation -->
              <div style="background:#ccff00;border:3px solid #000000;padding:20px 24px;margin-bottom:28px;">
                <p style="font-family:monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#000000;margin:0 0 6px 0;">
                  🤖 AI RECOMMENDATION
                </p>
                <p style="font-family:Arial,sans-serif;font-size:16px;font-weight:800;color:#000000;margin:0 0 4px 0;">
                  Reach out to ${recommendation}
                </p>
                <p style="font-family:Arial,sans-serif;font-size:13px;color:#333333;margin:0;">
                  ${recommendationReason}
                </p>
              </div>

              <!-- CTA -->
              <div style="text-align:center;">
                <a href="${appUrl}/weekly-report"
                   style="display:inline-block;background:#000000;color:#ccff00;font-family:monospace;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;padding:14px 32px;text-decoration:none;border:3px solid #000000;margin-right:12px;">
                  VIEW FULL REPORT →
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#111111;padding:20px 32px;text-align:center;">
              <p style="font-family:monospace;font-size:10px;color:#555555;margin:0;text-transform:uppercase;letter-spacing:0.1em;">
                BondIQ • Your AI Relationship Manager<br/>
                <a href="${appUrl}/settings" style="color:#ccff00;text-decoration:none;">Manage email preferences</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
