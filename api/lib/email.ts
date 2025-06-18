import fetch from 'node-fetch';

const SERVICE_ID = process.env.EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || '';

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const templateParams = {
      to_email: email,
      verification_link: `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`,
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID,
        user_id: PUBLIC_KEY,
        template_params: templateParams,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send verification email');
    }

    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}; 