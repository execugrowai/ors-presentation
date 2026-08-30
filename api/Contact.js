export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, section } = req.body || {};

  if (!message?.trim()) {
    return res.status(400).json({ error: 'Question is required' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const cleanName    = name?.trim()    || 'Not provided';
  const cleanEmail   = email?.trim()   || 'Not provided';
  const cleanSection = section?.trim() || 'General';
  const cleanMessage = message.trim();

  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'ORS Presentation <jason@infralaunchpro.com>',
      to: ['jason@infralaunchpro.com'],
      reply_to: cleanEmail !== 'Not provided' ? cleanEmail : undefined,
      subject: `ORS Question | ${cleanSection}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222;">
          <h2>New ORS Presentation Question</h2>
          <p><strong>Name:</strong> ${cleanName}</p>
          <p><strong>Email:</strong> ${cleanEmail}</p>
          <p><strong>Section:</strong> ${cleanSection}</p>
          <p><strong>Question:</strong><br>${cleanMessage}</p>
        </div>
      `
    })
  });

  const emailData = await emailResponse.json();

  if (!emailResponse.ok) {
    console.error('Resend error:', emailData);
    return res.status(500).json({ error: 'Email could not be sent', details: emailData });
  }

  return res.status(200).json({ success: true });
}
