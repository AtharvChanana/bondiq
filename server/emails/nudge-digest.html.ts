interface NudgeItem {
  personName: string
  reason: string
  draftMessage?: string | null
}

interface NudgeDigestEmailProps {
  userName: string
  nudges: NudgeItem[]
  appUrl: string
}

export function buildNudgeDigestHtml({ userName, nudges, appUrl }: NudgeDigestEmailProps): string {
  const greeting = userName ? userName.split(" ")[0] : "there"

  const nudgeRows = nudges
    .map(
      (n) => `
      <div style="background:#f7f7f7;border-left:4px solid #ccff00;padding:16px 20px;margin-bottom:12px;">
        <p style="margin:0 0 6px 0;font-family:monospace;font-size:11px;font-weight:700;text-transform:uppercase;color:#888888;letter-spacing:0.1em;">
          ${n.personName}
        </p>
        <p style="margin:0 0 10px 0;font-family:Arial,sans-serif;font-size:14px;font-weight:600;color:#111111;">
          ${n.reason}
        </p>
        ${
          n.draftMessage
            ? `<div style="background:#111111;color:#ccff00;padding:12px 16px;font-family:Arial,sans-serif;font-size:13px;font-style:italic;line-height:1.6;margin-top:8px;">
            💬 Suggested message: "${n.draftMessage}"
          </div>`
            : ""
        }
      </div>
    `
    )
    .join("")

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BondIQ — Your Daily Relationship Nudges</title>
</head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#000000;padding:24px 32px;border-bottom:4px solid #ccff00;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-family:Arial,sans-serif;font-size:22px;font-weight:900;color:#ffffff;text-transform:uppercase;letter-spacing:0.1em;">
                      ♥ BONDIQ
                    </span>
                  </td>
                  <td align="right">
                    <span style="background:#ccff00;color:#000000;font-family:monospace;font-size:10px;font-weight:700;text-transform:uppercase;padding:4px 10px;letter-spacing:0.1em;">
                      DAILY NUDGES
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:32px;border:4px solid #000000;border-top:none;">

              <h1 style="font-family:Arial,sans-serif;font-size:26px;font-weight:900;color:#000000;text-transform:uppercase;margin:0 0 8px 0;letter-spacing:-0.5px;">
                Hey ${greeting}, your relationships need attention 👋
              </h1>
              <p style="font-family:Arial,sans-serif;font-size:14px;color:#555555;margin:0 0 28px 0;line-height:1.6;">
                BondIQ detected <strong>${nudges.length} nudge${nudges.length !== 1 ? "s" : ""}</strong> for you today. Here's what's on your radar:
              </p>

              <!-- Nudges -->
              ${nudgeRows}

              <!-- CTA -->
              <div style="margin-top:28px;text-align:center;">
                <a href="${appUrl}/dashboard"
                   style="display:inline-block;background:#ccff00;color:#000000;font-family:monospace;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;padding:14px 32px;text-decoration:none;border:3px solid #000000;">
                  OPEN BONDIQ →
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
