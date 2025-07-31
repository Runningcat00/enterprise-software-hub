// Vercel serverless function for newsletter signup
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, source = 'enterprise_hub' } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email address required' });
  }

  try {
    // Option 1: Zapier Webhook Integration
    const zapierWebhook = process.env.ZAPIER_WEBHOOK_URL;
    
    if (zapierWebhook) {
      const response = await fetch(zapierWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source,
          timestamp: new Date().toISOString(),
          tags: ['early_access', 'enterprise_software', 'it_professional'],
          community_size: '30000+',
          platform: 'enterprise_software_hub'
        })
      });

      if (response.ok) {
        return res.status(200).json({ 
          success: true, 
          message: 'Successfully subscribed! You\'ll be notified when we launch.' 
        });
      }
    }

    // Option 2: Direct email service integration (Mailchimp, ConvertKit, etc.)
    // Add your preferred email service API integration here
    
    // Fallback: Log signup (for development/testing)
    console.log('Newsletter signup:', { email, source, timestamp: new Date() });
    
    return res.status(200).json({ 
      success: true, 
      message: 'Thanks for your interest! We\'ll add you to our early access list.' 
    });

  } catch (error) {
    console.error('Newsletter signup error:', error);
    
    // Always return success to user (graceful fallback)
    return res.status(200).json({ 
      success: true, 
      message: 'Thanks for signing up! We\'ll be in touch soon.' 
    });
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}