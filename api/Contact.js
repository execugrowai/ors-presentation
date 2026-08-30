export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {
    const { name, message, section } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: 'Question is required'
      });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'ORS Presentation <onboarding@resend.dev>',
        to: ['brentjclarkdesign@gmail.com'],
        subject: `ORS Presentation Question: ${section || 'General'}`,
        html: `
          <h2>New ORS Presentation Question</h2>
          <p><strong>Name:</strong> ${name || 'Not provided'}</p>
          <p><strong>Section:</strong> ${section || 'Not provided'}</p>
          <p><strong>Question:</strong></p>
          <p>${message.trim()}</p>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);

      return res.status(500).json({
        success: false,
        error: 'Unable to send email'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Question sent'
    });

  } catch (error) {
    console.error('Contact form error:', error);

    return res.status(500).json({
      success: false,
      error: 'Unable to process question'
    });
  }
}
