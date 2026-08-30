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

    console.log('Presentation question:', {
      name: name || 'Not provided',
      section: section || 'Not provided',
      message: message.trim()
    });

    return res.status(200).json({
      success: true,
      message: 'Question received'
    });

  } catch (error) {
    console.error('Question form error:', error);

    return res.status(500).json({
      success: false,
      error: 'Unable to process question'
    });
  }
}
