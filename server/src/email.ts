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

export async function sendVerificationEmail(
  to_email: string,
  verification_link: string
) {
  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to_email,
    subject: 'Verify Your Email - Weather Reporter',
    html: `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verification_link}">Verify Email</a>
      <p>If you did not create an account, please ignore this email.</p>
    `
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully to:', to_email);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
} 