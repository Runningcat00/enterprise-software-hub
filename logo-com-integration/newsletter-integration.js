// Enterprise Software Hub - Newsletter Integration for Logo.com
// Add this JavaScript to your Logo.com custom code section

// Configuration - Update these with your actual service credentials
const CONFIG = {
    // Mailchimp Configuration
    mailchimp: {
        apiUrl: 'https://us1.api.mailchimp.com/3.0/lists/YOUR_LIST_ID/members',
        apiKey: 'YOUR_MAILCHIMP_API_KEY', // Add to Logo.com environment
        listId: 'YOUR_MAILCHIMP_LIST_ID'
    },
    
    // ConvertKit Configuration (Alternative)
    convertkit: {
        apiUrl: 'https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe',
        apiKey: 'YOUR_CONVERTKIT_API_KEY',
        formId: 'YOUR_CONVERTKIT_FORM_ID'
    },
    
    // Google Analytics
    ga4MeasurementId: 'G-XXXXXXXXXX' // Replace with your GA4 ID
};

// Main newsletter signup function
async function handleNewsletterSignup(email) {
    if (!email || !isValidEmail(email)) {
        showMessage('Please enter a valid work email address.', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = document.querySelector('#newsletter-form button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Subscribing...';
    submitButton.disabled = true;
    
    try {
        // Try Mailchimp first (recommended for Logo.com)
        const success = await subscribeToMailchimp(email);
        
        if (success) {
            showMessage('✓ Success! You\'ll be notified when we launch.', 'success');
            document.getElementById('email-input').value = '';
            
            // Track successful signup
            trackEvent('newsletter_signup', 'engagement', 'early_access_signup');
            
            // Show additional success message
            setTimeout(() => {
                showMessage('Check your email for a welcome message with exclusive insights!', 'info');
            }, 2000);
            
        } else {
            throw new Error('Subscription failed');
        }
        
    } catch (error) {
        console.error('Newsletter signup error:', error);
        showMessage('Something went wrong. Please try again or contact support.', 'error');
    } finally {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Mailchimp integration
async function subscribeToMailchimp(email) {
    try {
        // For Logo.com, use a serverless function or Zapier webhook
        const webhookUrl = 'YOUR_ZAPIER_WEBHOOK_URL'; // Set up Zapier integration
        
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                source: 'enterprise_software_hub_landing',
                timestamp: new Date().toISOString(),
                tags: ['early_access', 'enterprise_software', 'it_professional'],
                merge_fields: {
                    SIGNUP_PAGE: 'coming_soon_landing',
                    INTERESTS: 'enterprise_software_comparison'
                }
            })
        });
        
        return response.ok;
        
    } catch (error) {
        console.error('Mailchimp subscription error:', error);
        return false;
    }
}

// ConvertKit integration (alternative)
async function subscribeToConvertKit(email) {
    try {
        const response = await fetch(CONFIG.convertkit.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                api_key: CONFIG.convertkit.apiKey,
                email: email,
                tags: ['early_access', 'enterprise_software'],
                fields: {
                    source: 'enterprise_software_hub_landing',
                    signup_date: new Date().toISOString()
                }
            })
        });
        
        const data = await response.json();
        return data.subscription && data.subscription.state === 'active';
        
    } catch (error) {
        console.error('ConvertKit subscription error:', error);
        return false;
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show messages to user
function showMessage(message, type = 'info') {
    const resultDiv = document.getElementById('signup-result');
    if (!resultDiv) return;
    
    const colors = {
        success: 'text-green-300',
        error: 'text-red-300',
        info: 'text-blue-300'
    };
    
    resultDiv.innerHTML = `<span class="${colors[type]}">${message}</span>`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        resultDiv.innerHTML = '';
    }, 5000);
}

// Analytics tracking
function trackEvent(eventName, category, label, value = null) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('trackCustom', eventName, {
            category: category,
            label: label,
            source: 'enterprise_software_hub'
        });
    }
    
    // Console log for debugging
    console.log('Event tracked:', eventName, category, label);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Set up newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email-input').value.trim();
            handleNewsletterSignup(email);
        });
    }
    
    // Track page view
    trackEvent('page_view', 'engagement', 'landing_page');
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
            maxScroll = scrollPercent;
            trackEvent('scroll_depth', 'engagement', `${scrollPercent}%`);
        }
    });
});

// Scroll to signup function (called by CTA buttons)
function scrollToSignup() {
    const emailInput = document.getElementById('email-input');
    if (emailInput) {
        emailInput.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        setTimeout(() => emailInput.focus(), 500);
        
        // Track CTA click
        trackEvent('cta_click', 'engagement', 'scroll_to_signup');
    }
}

// Social sharing functions
function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Enterprise Software Hub - Compare 200+ business software solutions. Launching soon!');
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&text=${text}`, '_blank');
    trackEvent('social_share', 'engagement', 'linkedin');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Excited for @EnterpriseSoftwareHub launch! Compare 200+ business software solutions. #EnterpriseSoftware #SaaS');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    trackEvent('social_share', 'engagement', 'twitter');
}

// Advanced tracking for enterprise-specific events
function trackEnterpriseInterest(category) {
    trackEvent('category_interest', 'software_category', category);
    
    // Store interest in localStorage for future targeting
    const interests = JSON.parse(localStorage.getItem('software_interests') || '[]');
    if (!interests.includes(category)) {
        interests.push(category);
        localStorage.setItem('software_interests', JSON.stringify(interests));
    }
}

// Exit intent detection (to show final CTA)
let exitIntentShown = false;
document.addEventListener('mouseleave', function(e) {
    if (e.clientY <= 0 && !exitIntentShown) {
        exitIntentShown = true;
        showExitIntentModal();
        trackEvent('exit_intent', 'engagement', 'modal_shown');
    }
});

function showExitIntentModal() {
    // Create exit intent modal HTML
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 2rem; border-radius: 1rem; max-width: 500px; text-align: center;">
                <h3 style="color: #1e40af; font-size: 1.5rem; margin-bottom: 1rem;">Wait! Don't Miss Our Launch 🚀</h3>
                <p style="color: #6b7280; margin-bottom: 1.5rem;">Join 30,000+ IT professionals getting early access to the most comprehensive enterprise software comparison platform.</p>
                <input type="email" id="exit-email" placeholder="Enter your work email" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; margin-bottom: 1rem;">
                <div style="display: flex; gap: 1rem;">
                    <button onclick="closeExitModal()" style="flex: 1; padding: 0.75rem; background: #f3f4f6; border: none; border-radius: 0.5rem; cursor: pointer;">No Thanks</button>
                    <button onclick="submitExitEmail()" style="flex: 1; padding: 0.75rem; background: #1e40af; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">Get Early Access</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeExitModal() {
    const modal = document.querySelector('[style*="position: fixed"]');
    if (modal) modal.remove();
    trackEvent('exit_intent', 'engagement', 'modal_closed');
}

function submitExitEmail() {
    const email = document.getElementById('exit-email').value;
    if (email) {
        handleNewsletterSignup(email);
        closeExitModal();
        trackEvent('exit_intent', 'conversion', 'email_submitted');
    }
}

// Export functions for global access
window.EnterpriseHub = {
    handleNewsletterSignup,
    scrollToSignup,
    shareOnLinkedIn,
    shareOnTwitter,
    trackEnterpriseInterest,
    trackEvent
};