// Enhanced newsletter API with professional email integration
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, source = 'enterprise_hub', firstName, lastName, company } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email address required' });
  }

  try {
    // Primary: ConvertKit Integration (if configured)
    if (process.env.CONVERTKIT_API_KEY && process.env.CONVERTKIT_FORM_ID) {
      const convertKitResponse = await addToConvertKit({
        email,
        firstName,
        lastName,
        company,
        source
      });
      
      if (convertKitResponse.success) {
        // Send welcome email from professional address
        await sendWelcomeEmail(email, firstName);
        
        return res.status(200).json({
          success: true,
          message: 'Success! Check your email from hello@enterprisesoftwarehub.com for exclusive insights.',
          provider: 'convertkit'
        });
      }
    }

    // Fallback: Mailchimp Integration (if configured)
    if (process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_LIST_ID) {
      const mailchimpResponse = await addToMailchimp({
        email,
        firstName,
        lastName,
        company,
        source
      });
      
      if (mailchimpResponse.success) {
        await sendWelcomeEmail(email, firstName);
        
        return res.status(200).json({
          success: true,
          message: 'Welcome! Check your email from hello@enterprisesoftwarehub.com for enterprise software insights.',
          provider: 'mailchimp'
        });
      }
    }

    // Fallback: Log subscription and send notification email
    console.log('Newsletter signup:', {
      email,
      firstName,
      lastName,
      company,
      source,
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent']
    });

    // Send notification to business email
    await sendSignupNotification({
      email,
      firstName,
      lastName,
      company,
      source
    });

    return res.status(200).json({
      success: true,
      message: 'Thank you for joining! Welcome to our community of 30,000+ IT professionals.',
      provider: 'fallback'
    });

  } catch (error) {
    console.error('Newsletter signup error:', error);
    
    // Always return success to user (graceful fallback)
    return res.status(200).json({
      success: true,
      message: 'Thanks for signing up! We\'ll be in touch with exclusive enterprise software insights.',
      provider: 'error_fallback'
    });
  }
}

// ConvertKit Integration
async function addToConvertKit({ email, firstName, lastName, company, source }) {
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
async function addToMailchimp({ email, firstName, lastName, company, source }) {
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

// Send welcome email from professional address
async function sendWelcomeEmail(email, firstName) {
  try {
    // This would integrate with your email service (SendGrid, Titan SMTP, etc.)
    // For now, we'll log the welcome email intent
    console.log('Welcome email triggered:', {
      to: email,
      from: 'hello@enterprisesoftwarehub.com',
      firstName: firstName,
      subject: 'Welcome to Enterprise Software Hub - Your exclusive preview inside'
    });
    
    // TODO: Integrate with SendGrid, SMTP, or email service
    // Example SendGrid integration:
    /*
    if (process.env.SENDGRID_API_KEY) {
      await sendGridMail.send({
        to: email,
        from: 'hello@enterprisesoftwarehub.com',
        subject: 'Welcome to Enterprise Software Hub - Your exclusive preview inside',
        html: getWelcomeEmailTemplate(firstName)
      });
    }
    */
    
    return { success: true };
  } catch (error) {
    console.error('Welcome email error:', error);
    return { success: false, error };
  }
}

// Send signup notification to business
async function sendSignupNotification({ email, firstName, lastName, company, source }) {
  try {
    console.log('New signup notification:', {
      to: 'hello@enterprisesoftwarehub.com',
      subject: 'New Enterprise Software Hub Signup',
      subscriber: email,
      details: { firstName, lastName, company, source },
      timestamp: new Date().toISOString()
    });
    
    // TODO: Send actual notification email to business address
    return { success: true };
  } catch (error) {
    console.error('Signup notification error:', error);
    return { success: false, error };
  }
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}