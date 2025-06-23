import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { sendVerificationEmail } from './email';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { UserModel } from './models/User';
import { prisma } from './db';

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
  const { username, email, password, country } = req.body;
  
  // Validate required fields
  if (!username || !email || !password || !country) {
    return res.status(400).json({ error: 'Username, email, password, and country are required' });
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
    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      verification_token: verificationToken,
      country,
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

    const wasVerified = await UserModel.verify(token);

    if (!wasVerified) {
        // To provide a more specific error, we can check if the user exists but was already verified.
        // This adds a DB call, but improves UX. Consider if this is a performance concern.
        const user = await UserModel.findByVerificationToken(token);
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
  const { identifier, password } = req.body;
  
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Email/Username and password are required' });
  }

  const user = await UserModel.findByIdentifier(identifier);

  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  if (!user.is_verified) return res.status(400).json({ error: 'Please verify your email before logging in.' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

  // User is authenticated, create JWT
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET as string,
    { expiresIn: '24h' }
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
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update Profile
app.put('/api/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { username, country } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Basic validation
  if (!username || username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
  }
  
  try {
    const updatedUser = await UserModel.update(userId, { username, country });
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error: any) {
    if (error.code === 'P2002') { // Unique constraint violation
        return res.status(409).json({ error: 'This username is already taken.' });
    }
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Create Weather Update
app.post('/api/weather-updates', authMiddleware, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { locationName, lat, lon, temperature, conditions } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!locationName || lat === undefined || lon === undefined || temperature === undefined || !conditions) {
    return res.status(400).json({ error: 'Location name, coordinates, temperature, and conditions are required.' });
  }

  try {
    const newUpdate = await prisma.weatherUpdate.create({
      data: {
        locationName,
        lat,
        lon,
        temperature,
        conditions,
        authorId: userId,
      },
    });
    res.status(201).json(newUpdate);
  } catch (error) {
    console.error('Failed to create weather update:', error);
    res.status(500).json({ error: 'Failed to create weather update.' });
  }
});

// Weather API endpoint
app.get('/api/weather', async (req, res) => {
  try {
    const weatherApiKey = process.env.WEATHER_API_KEY;
    if (!weatherApiKey) {
      return res.status(500).json({ error: 'Weather API key not configured' });
    }

    // Get location from query parameters, default to Colombo
    const location = typeof req.query.location === 'string' ? req.query.location : 'Colombo';
    const url = `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${encodeURIComponent(location)}&aqi=no`;

    const response = await axios.get(url);
    const weatherData = response.data;

    // Extract the required weather information
    const weather = {
      location: {
        name: weatherData.location.name,
        country: weatherData.location.country,
        localtime: weatherData.location.localtime,
        region: weatherData.location.region || null,
        lat: weatherData.location.lat,
        lon: weatherData.location.lon
      },
      current: {
        temperature: {
          celsius: weatherData.current.temp_c,
          fahrenheit: weatherData.current.temp_f
        },
        humidity: weatherData.current.humidity,
        windSpeed: {
          kph: weatherData.current.wind_kph,
          mph: weatherData.current.wind_mph
        },
        uvIndex: weatherData.current.uv,
        condition: {
          text: weatherData.current.condition.text,
          icon: weatherData.current.condition.icon
        },
        feelsLike: {
          celsius: weatherData.current.feelslike_c,
          fahrenheit: weatherData.current.feelslike_f
        }
      }
    };

    res.json(weather);
  } catch (error: any) {
    console.error('Weather API error:', error);
    if (error.response?.status === 400) {
      return res.status(400).json({ error: 'Location not found. Please check the spelling and try again.' });
    }
    if (error.response?.status === 401) {
      return res.status(500).json({ error: 'Invalid weather API key' });
    }
    res.status(500).json({ error: 'Failed to fetch weather data' });
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