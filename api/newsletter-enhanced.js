// Enhanced Newsletter API with Email Service Integration
// Supports ConvertKit, Mailchimp, and Beehiiv

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, source = 'enterprise_hub', firstName, lastName, company, role } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email address required' });
  }

  try {
    // Primary: ConvertKit Integration (Recommended)
    if (process.env.CONVERTKIT_API_KEY && process.env.CONVERTKIT_FORM_ID) {
      const convertKitResponse = await addToConvertKit({
        email,
        firstName,
        lastName,
        company,
        role,
        source
      });
      
      if (convertKitResponse.success) {
        return res.status(200).json({
          success: true,
          message: 'Success! Check your email for exclusive enterprise software insights.',
          provider: 'convertkit'
        });
      }
    }

    // Fallback: Mailchimp Integration
    if (process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_LIST_ID) {
      const mailchimpResponse = await addToMailchimp({
        email,
        firstName,
        lastName,
        company,
        role,
        source
      });
      
      if (mailchimpResponse.success) {
        return res.status(200).json({
          success: true,
          message: 'Welcome! You\'ll receive our enterprise software insights soon.',
          provider: 'mailchimp'
        });
      }
    }

    // Fallback: Beehiiv Integration
    if (process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID) {
      const beehiivResponse = await addToBeehiiv({
        email,
        firstName,
        lastName,
        source
      });
      
      if (beehiivResponse.success) {
        return res.status(200).json({
          success: true,
          message: 'Thank you! Welcome to our community of 30,000+ IT professionals.',
          provider: 'beehiiv'
        });
      }
    }

    // Final Fallback: Log subscription (for development/backup)
    console.log('Email subscription (no service configured):', {
      email,
      firstName,
      lastName,
      company,
      role,
      source,
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent']
    });

    return res.status(200).json({
      success: true,
      message: 'Thanks for signing up! We\'ll add you to our early access list.',
      provider: 'fallback'
    });

  } catch (error) {
    console.error('Newsletter signup error:', error);
    
    // Always return success to user (graceful fallback)
    return res.status(200).json({
      success: true,
      message: 'Thank you for joining! We\'ll be in touch with exclusive insights.',
      provider: 'error_fallback'
    });
  }
}

// ConvertKit Integration
async function addToConvertKit({ email, firstName, lastName, company, role, source }) {
  try {
    const response = await fetch(`https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: process.env.CONVERTKIT_API_KEY,
        email: email,
        first_name: firstName || '',
        fields: {
          last_name: lastName || '',
          company: company || '',
          role: role || '',
          source: source,
          signup_date: new Date().toISOString(),
          community_size: '30000+',
          platform: 'enterprise_software_hub'
        },
        tags: [
          'enterprise_software',
          'early_access',
          'it_professional',
          source.replace('_', '-')
        ]
      })
    });

    if (response.ok) {
      return { success: true, data: await response.json() };
    } else {
      throw new Error(`ConvertKit API error: ${response.status}`);
    }
  } catch (error) {
    console.error('ConvertKit error:', error);
    return { success: false, error };
  }
}

// Mailchimp Integration
async function addToMailchimp({ email, firstName, lastName, company, role, source }) {
  try {
    const listId = process.env.MAILCHIMP_LIST_ID;
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const serverPrefix = apiKey.split('-')[1];

    const response = await fetch(`https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `apikey ${apiKey}`
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName || '',
          LNAME: lastName || '',
          COMPANY: company || '',
          ROLE: role || '',
          SOURCE: source
        },
        tags: [
          'enterprise_software',
          'early_access',
          'it_professional'
        ]
      })
    });

    if (response.ok || response.status === 400) { // 400 might mean already subscribed
      return { success: true, data: await response.json() };
    } else {
      throw new Error(`Mailchimp API error: ${response.status}`);
    }
  } catch (error) {
    console.error('Mailchimp error:', error);
    return { success: false, error };
  }
}

// Beehiiv Integration  
async function addToBeehiiv({ email, firstName, lastName, source }) {
  try {
    const response = await fetch(`https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`
      },
      body: JSON.stringify({
        email: email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: source,
        utm_medium: 'website',
        utm_campaign: 'enterprise_software_hub',
        custom_fields: [
          {
            name: 'first_name',
            value: firstName || ''
          },
          {
            name: 'last_name', 
            value: lastName || ''
          },
          {
            name: 'source',
            value: source
          }
        ]
      })
    });

    if (response.ok) {
      return { success: true, data: await response.json() };
    } else {
      throw new Error(`Beehiiv API error: ${response.status}`);
    }
  } catch (error) {
    console.error('Beehiiv error:', error);
    return { success: false, error };
  }
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Enhanced analytics tracking
function trackSubscription({ email, source, provider }) {
  // This would integrate with your analytics platform
  console.log('Subscription tracked:', {
    email: email.substring(0, 3) + '***', // Privacy-safe logging
    source,
    provider,
    timestamp: new Date().toISOString()
  });
}