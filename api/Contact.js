export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Name, email and message are required'
      });
    }

    console.log('Contact submission:', {
      name,
      email,
      message
    });

    return res.status(200).json({
      success: true,
      message: 'Message received'
    });

  } catch (error) {
    console.error('Contact form error:', error);

    return res.status(500).json({
      success: false,
      error: 'Unable to process message'
    });
  }
}
