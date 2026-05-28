export function buildWelcomeHtml(params: { userName: string; appUrl: string }) {
  const { userName, appUrl } = params
  const greeting = userName ? userName.split(" ")[0] : "there"

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to BondIQ</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f0f0f0; padding: 32px; color: #000; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 4px solid #000; padding: 32px; box-shadow: 8px 8px 0px #000;">
    
    <div style="background: #000; color: #ccff00; padding: 16px 24px; margin: -32px -32px 32px -32px; font-weight: 900; font-size: 24px; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 4px solid #000;">
      ♥ BONDIQ
    </div>
    
    <h1 style="font-size: 28px; font-weight: 900; color: #000; text-transform: uppercase; margin: 0 0 16px 0; letter-spacing: -0.02em;">
      Welcome to the network, ${greeting}.
    </h1>
    
    <p style="font-size: 16px; color: #333; margin: 0 0 24px 0;">
      You've just taken the first step towards never letting a meaningful relationship fade away. BondIQ is your personal CRM for the people who actually matter.
    </p>

    <div style="background: #f8f8f8; border: 2px dashed #000; padding: 24px; margin: 0 0 32px 0;">
      <h2 style="font-size: 14px; font-weight: 900; text-transform: uppercase; margin: 0 0 12px 0; color: #666;">
        HOW TO GET STARTED
      </h2>
      
      <ol style="margin: 0; padding-left: 20px; font-size: 15px; color: #000; font-weight: bold;">
        <li style="margin-bottom: 12px;">Add your most important people (friends, family, mentors).</li>
        <li style="margin-bottom: 12px;">Log a quick interaction when you hang out or text.</li>
        <li style="margin-bottom: 0;">Let our AI do the math and nudge you when it's time to reach out.</li>
      </ol>
    </div>

    <a href="${appUrl}/people/new" style="display: inline-block; background: #ccff00; color: #000; font-weight: 900; font-size: 15px; text-transform: uppercase; letter-spacing: 0.08em; padding: 16px 32px; text-decoration: none; border: 3px solid #000; box-shadow: 4px 4px 0px #000;">
      ADD YOUR FIRST PERSON →
    </a>

    <div style="margin-top: 48px; padding-top: 24px; border-top: 2px solid #eee; font-size: 12px; color: #888; text-transform: uppercase; font-family: monospace;">
      <p style="margin: 0;">BondIQ AI Engine • System Online</p>
      <p style="margin: 8px 0 0 0;">
        <a href="${appUrl}/settings" style="color: #000; font-weight: bold;">Notification Settings</a>
      </p>
    </div>
  </div>
</body>
</html>`
}
