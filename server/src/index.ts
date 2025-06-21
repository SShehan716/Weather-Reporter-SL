import express, { Request, Response, NextFunction } from 'express';
import { prisma } from './db';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { sendVerificationEmail } from './email';
import cors from 'cors';
import jwt from 'jsonwebtoken';

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
  const { username, email, password } = req.body;
  
  // Validate required fields
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  // Validate username length
  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  try {
    const user = await prisma.user.create({
      data: {
        username,
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
    
    // Check if this is a unique constraint error
    if (err.code === 'P2002') {
      if (err.meta?.target?.includes('email')) {
        return res.status(400).json({ error: 'This email is already registered.' });
      }
      if (err.meta?.target?.includes('username')) {
        return res.status(400).json({ error: 'This username is already taken.' });
      }
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
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email/Username and password are required' });
  }

  // Try to find user by email or username
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: email },
        { username: email }
      ]
    }
  });

  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  if (!user.is_verified) return res.status(400).json({ error: 'Please verify your email before logging in.' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

  // User is authenticated, create JWT
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET as string,
    { expiresIn: '24h' } // Token expires in 24 hours
  );

  res.json({ 
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  });
});

// Auth Middleware
interface AuthRequest extends Request {
  user?: { userId: number; username: string };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded as { userId: number; username: string };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// A protected route to test authentication
app.get('/api/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  // Thanks to the middleware, we know req.user is defined.
  const userId = req.user?.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        is_verified: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Weather Reporter API' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 