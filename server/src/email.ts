import nodemailer from 'nodemailer';

// Log the email configuration to debug
console.log('[Email Service] Initializing transporter...');
console.log(`[Email Service] EMAIL_USER: ${process.env.EMAIL_USER ? 'loaded' : 'MISSING'}`);
console.log(`[Email Service] EMAIL_APP_PASSWORD: ${process.env.EMAIL_APP_PASSWORD ? 'loaded' : 'MISSING'}`);

// Create reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD // Gmail App Password
  }
});

// Email delivery tracking
const emailDeliveryStatus = new Map<string, { sent: boolean; timestamp: Date; attempts: number }>();

export async function sendVerificationEmail(
  to_email: string,
  verification_link: string
) {
  const emailId = `${to_email}_${Date.now()}`;
  const sentTime = new Date();
  
  // Track email delivery
  emailDeliveryStatus.set(emailId, {
    sent: false,
    timestamp: sentTime,
    attempts: 0
  });

  // Email options with improved content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to_email,
    subject: 'Verify Your Email - Weather Reporter',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2c3e50; text-align: center;">Email Verification</h1>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="font-size: 16px; color: #34495e; margin-bottom: 20px;">
            Thank you for registering with Weather Reporter! Please click the button below to verify your email address:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verification_link}" 
               style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="font-size: 14px; color: #7f8c8d; margin-top: 20px;">
            <strong>Security:</strong> Do not share this link with anyone.
          </p>
          <p style="font-size: 14px; color: #7f8c8d;">
            <strong>Sent at:</strong> ${sentTime.toLocaleString()}
          </p>
        </div>
        <p style="font-size: 14px; color: #95a5a6; text-align: center;">
          If you did not create an account, please ignore this email.
        </p>
      </div>
    `
  };

  // Send email with retry logic
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Verification email sent successfully to: ${to_email} (attempt ${attempts + 1})`);
      
      // Update delivery status
      const status = emailDeliveryStatus.get(emailId);
      if (status) {
        status.sent = true;
        status.attempts = attempts + 1;
      }
      
      return { success: true, emailId, sentTime };
    } catch (error) {
      attempts++;
      console.error(`Error sending verification email (attempt ${attempts}):`, error);
      
      if (attempts >= maxAttempts) {
        // Update delivery status
        const status = emailDeliveryStatus.get(emailId);
        if (status) {
          status.attempts = attempts;
        }
        
        throw new Error('Failed to send verification email after multiple attempts');
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
    }
  }
}

export async function sendResetPasswordEmail(
  to_email: string,
  reset_link: string
) {
  const sentTime = new Date();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to_email,
    subject: 'Reset Your Password - Weather Reporter',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2c3e50; text-align: center;">Password Reset</h1>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="font-size: 16px; color: #34495e; margin-bottom: 20px;">
            You requested to reset your password. Click the button below to create a new password. This link is valid for 1 hour:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${reset_link}" 
               style="background-color: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 14px; color: #7f8c8d; margin-top: 20px;">
            <strong>Security:</strong> Do not share this link with anyone.
          </p>
          <p style="font-size: 14px; color: #7f8c8d;">
            <strong>Sent at:</strong> ${sentTime.toLocaleString()}
          </p>
        </div>
        <p style="font-size: 14px; color: #95a5a6; text-align: center;">
          If you did not request this, you can safely ignore this email.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully to:', to_email);
    return { success: true, sentTime };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}

// Function to check email delivery status
export function getEmailDeliveryStatus(emailId: string) {
  return emailDeliveryStatus.get(emailId);
}

// Function to clean up old email status entries (run periodically)
export function cleanupEmailStatus() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  for (const [emailId, status] of emailDeliveryStatus.entries()) {
    if (status.timestamp < oneHourAgo) {
      emailDeliveryStatus.delete(emailId);
    }
  }
} 