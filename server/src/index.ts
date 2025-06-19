import express from 'express';
import { prisma } from './db';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { sendVerificationEmail } from './email';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Debug: Log environment variables
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Register
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verification_token: verificationToken,
      },
    });
    const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${verificationToken}`;
    await sendVerificationEmail(email, verificationLink);
    res.status(201).json({ message: 'User registered. Please check your email to verify your account.' });
  } catch (err: any) {
    console.error('Register error:', err);
    
    // Check if this is a unique constraint error (duplicate email)
    if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
      return res.status(400).json({ error: 'This email is already registered.' });
    }
    
    // Check if this is an email sending error
    if (err.message === 'Failed to send verification email') {
      return res.status(500).json({ 
        error: 'Registration successful but failed to send verification email. Please contact support.' 
      });
    }
    
    // Generic error
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Verify
app.get('/api/verify', async (req, res) => {
  const { token } = req.query;
  
  try {
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    // Try to find and update the user
    const updateResult = await prisma.user.updateMany({
      where: { 
        verification_token: token,
        is_verified: false  // Only verify if not already verified
      },
      data: { 
        is_verified: true,
        verification_token: null
      }
    });

    if (updateResult.count === 0) {
      // Check if user was already verified
      const user = await prisma.user.findFirst({
        where: { verification_token: token }
      });

      if (user?.is_verified) {
        return res.status(400).json({ error: 'Email was already verified' });
      }

      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    res.json({ message: 'Email verified successfully! You can now log in.' });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ error: 'Verification failed. Please try again.' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  if (!user.is_verified) return res.status(400).json({ error: 'Email not verified' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

  res.json({ message: 'Login successful' });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Weather Reporter API' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 