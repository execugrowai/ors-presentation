export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const { name, message, section } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Question is required'
      });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is missing');

      return res.status(500).json({
        success: false,
        error: 'Email service is not configured'
      });
    }

    const cleanName = name?.trim() || 'Not provided';
    const cleanSection = section?.trim() || 'General';
    const cleanMessage = message.trim();

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'ORS Presentation <onboarding@resend.dev>',
        to: ['brentjclarkdesign@gmail.com'],
        subject: `ORS Presentation Question | ${cleanSection}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
            <h2 style="margin-bottom: 20px;">New ORS Presentation Question</h2>

            <p>
              <strong>Name:</strong><br>
              ${cleanName}
            </p>

            <p>
              <strong>Section:</strong><br>
              ${cleanSection}
            </p>

            <p>
              <strong>Question:</strong><br>
              ${cleanMessage}
            </p>
          </div>
        `
      })
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error('Resend error:', emailData);

      return res.status(500).json({
        success: false,
        error: 'Email could not be sent',
        details: emailData
      });
    }

    console.log('Question emailed successfully:', {
      id: emailData.id,
      name: cleanName,
      section: cleanSection
    });

    return res.status(200).json({
      success: true,
      message: 'Question sent successfully'
    });

  } catch (error) {
    console.error('Contact form error:', error);

    return res.status(500).json({
      success: false,
      error: 'Unable to process question'
    });
  }
}
