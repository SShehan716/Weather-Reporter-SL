import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { sendVerificationEmail, sendResetPasswordEmail, getEmailDeliveryStatus, cleanupEmailStatus } from './email';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { UserModel } from './models/User';
import { WeatherUpdateModel } from './models/WeatherUpdate';
import { RiskUpdateModel } from './models/RiskUpdate';
import { UpdateModel } from './models/Update';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Client } from "@googlemaps/google-maps-services-js";
import cookieParser from 'cookie-parser';

// --- Google Maps Client Setup ---
const googleMapsClient = new Client({});
const countryCoordCache = new Map<string, { lat: number; lon: number }>();
// --- End Google Maps Client Setup ---

// --- Cloudinary Setup ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'weather-reporter-risks',
    format: async (req: Request, file: Express.Multer.File) => 'png',
    public_id: (req: Request, file: Express.Multer.File) => 'risk-' + Date.now(),
  } as any,
});

const upload = multer({ storage: storage });
// --- End Cloudinary Setup ---

// Load environment variables
dotenv.config();

// Debug: Log environment variables
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('GOOGLE_MAPS_API_KEY available:', !!process.env.GOOGLE_MAPS_API_KEY);

const app = express();
const port = process.env.PORT || 5000;

// Trust proxy for Heroku/production
app.set('trust proxy', 1);

// Middleware
app.use(cors({ 
  origin: process.env.FRONTEND_URL, 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Redirect HTTP to HTTPS in production (Heroku)
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});

// Register
app.post('/api/register', async (req, res) => {
  const { username, email, password, country } = req.body;
  
  if (!username || !email || !password || !country) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  // --- New logic for existing email ---
  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    if (!existingUser.is_verified) {
      return res.status(400).json({ error: 'This email is already registered but not verified. Please request a new verification email.' });
    } else {
      return res.status(400).json({ error: 'This email is already registered. If you forgot your password, please request a password reset.' });
    }
  }
  // --- End new logic ---

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  try {
    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      verification_token: verificationToken,
      country,
      reset_token: null,
      reset_token_expiry: null,
      lastVerificationEmailSent: null,
      lastResetEmailSent: null,
    });
    
    const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${verificationToken}`;
    const emailResult = await sendVerificationEmail(email, verificationLink);
    
    res.status(201).json({ 
      message: 'Registration successful! Please check your email to verify your account.',
      emailInfo: {
        sentAt: emailResult?.sentTime || new Date(),
        emailId: emailResult?.emailId || 'unknown',
        note: 'Email delivery can take a few minutes. Please check your spam/junk folder if you don\'t see it in your inbox.'
      }
    });
  } catch (err: any) {
    console.error('Register error:', err);
    
    if (err.code === 'P2002') {
      if (err.meta?.target?.includes('email')) {
        return res.status(400).json({ error: 'This email is already registered.' });
      }
      if (err.meta?.target?.includes('username')) {
        return res.status(400).json({ error: 'This username is already taken.' });
      }
    }
    
    if (err.message === 'Failed to send verification email after multiple attempts') {
      return res.status(500).json({ 
        error: 'Registration successful but failed to send verification email. Please contact support or try again later.',
        note: 'You can try logging in later if the email arrives, or contact support for assistance.'
      });
    }
    
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Check Email Delivery Status
app.get('/api/email-status/:emailId', async (req, res) => {
  const { emailId } = req.params;
  
  if (!emailId) {
    return res.status(400).json({ error: 'Email ID is required' });
  }

  try {
    const status = getEmailDeliveryStatus(emailId);
    
    if (!status) {
      return res.status(404).json({ error: 'Email status not found' });
    }

    res.json({
      emailId,
      sent: status.sent,
      timestamp: status.timestamp,
      attempts: status.attempts,
      message: status.sent 
        ? 'Email was sent successfully' 
        : 'Email delivery is in progress or failed'
    });
  } catch (error) {
    console.error('Email status check error:', error);
    res.status(500).json({ error: 'Failed to check email status' });
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

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
  });

  res.json({ 
    message: 'Login successful',
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  });
});

// Logout
app.post('/api/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.json({ message: 'Logged out successfully' });
});

// Forgot Password
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const user = await UserModel.findByEmail(email);
  if (!user) return res.status(200).json({ message: 'If that email is registered, a reset link has been sent.' });

  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await UserModel.setResetToken(user.id, token, expiry);

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await sendResetPasswordEmail(email, resetLink);

  res.json({ message: 'If that email is registered, a reset link has been sent.' });
});

// Reset Password
app.post('/api/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Token and new password are required' });

  const user = await UserModel.findByResetToken(token);
  if (!user || !user.reset_token_expiry || user.reset_token_expiry < new Date()) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await UserModel.updatePasswordAndClearResetToken(user.id, hashedPassword);

  res.json({ message: 'Password reset successful. You can now log in.' });
});

// Auth Middleware
interface AuthRequest extends Request {
  user?: { userId: number; username: string };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

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

  if (!username || username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
  }
  
  try {
    const updatedUser = await UserModel.update(userId, { username, country });
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error: any) {
    if (error.code === 'P2002') { 
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
    const newUpdate = await WeatherUpdateModel.create({
      locationName,
      lat,
      lon,
      temperature,
      conditions,
      authorId: userId,
    });
    res.status(201).json(newUpdate);
  } catch (error) {
    console.error('Failed to create weather update:', error);
    res.status(500).json({ error: 'Failed to create weather update.' });
  }
});

// Create Risk Update
app.post('/api/risk-updates', authMiddleware, upload.single('image'), async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { locationName, lat, lon, disasterType } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required.' });
  }
  
  if (!locationName || lat === undefined || lon === undefined || !disasterType) {
    return res.status(400).json({ error: 'Location, disaster type, and image are required.' });
  }

  const imageUrl = req.file.path;

  try {
    await RiskUpdateModel.create({
      locationName,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      disasterType,
      imageUrl,
      authorId: userId,
    });
    res.status(201).json({ message: 'Risk update created successfully', imageUrl });
  } catch (error) {
    console.error('Failed to create risk update:', error);
    res.status(500).json({ error: 'Failed to create risk update.' });
  }
});

// Get All Updates (Paginated)
app.get('/api/all-updates', authMiddleware, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = 10;
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await UpdateModel.findAllByAuthorId(userId, page, pageSize);
    res.json(result);
  } catch (error) {
    console.error('Failed to fetch all updates:', error);
    res.status(500).json({ error: 'Failed to fetch updates.' });
  }
});

// Get Nearby Updates (for dashboard or specific location)
app.get('/api/nearby-updates', authMiddleware, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { lat, lon, radius = 50 } = req.query; 

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    let updates;
    let userCountry: string | null = null;
    let searchLocation: { lat: number; lon: number } | null = null;

    if (lat && lon) {
      const parsedLat = parseFloat(lat as string);
      const parsedLon = parseFloat(lon as string);
      const parsedRadius = parseFloat(radius as string);
      updates = await UpdateModel.findNearby(parsedLat, parsedLon, parsedRadius);
      searchLocation = { lat: parsedLat, lon: parsedLon };
    } else {
      const user = await UserModel.findById(userId);
      if (!user || !user.country) {
        return res.json({ updates: [], userCountry: null, searchLocation: null });
      }
      userCountry = user.country;
      updates = await UpdateModel.findAllByCountry(userCountry);
    }
    
    res.json({ updates, userCountry, searchLocation });
  } catch (error) {
    console.error('Failed to fetch nearby updates:', error);
    res.status(500).json({ error: 'Failed to fetch nearby updates.' });
  }
});

// Weather API endpoint
app.get('/api/weather', async (req, res) => {
  try {
    const weatherApiKey = process.env.WEATHER_API_KEY;
    if (!weatherApiKey) {
      return res.status(500).json({ error: 'Weather API key not configured' });
    }

    const location = typeof req.query.location === 'string' ? req.query.location : 'Colombo';
    const url = `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${encodeURIComponent(location)}&aqi=no`;

    const response = await axios.get(url);
    const weatherData = response.data;

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

// Clean up old email status entries every hour
setInterval(() => {
  cleanupEmailStatus();
  console.log('[Email Service] Cleaned up old email status entries');
}, 60 * 60 * 1000); // Run every hour

// Resend Verification Email
app.post('/api/resend-verification', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const user = await UserModel.findByEmail(email);
  if (!user) return res.status(400).json({ error: 'User not found' });
  if (user.is_verified) return res.status(400).json({ error: 'User already verified' });
  const lastSent = await UserModel.getLastVerificationEmailSent(email);
  const now = new Date();
  if (lastSent && now.getTime() - lastSent.getTime() < 60 * 1000) {
    const wait = 60 - Math.floor((now.getTime() - lastSent.getTime()) / 1000);
    return res.status(429).json({ error: `Please wait ${wait}s before resending.` });
  }
  if (!user.verification_token) return res.status(400).json({ error: 'No verification token found.' });
  const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${user.verification_token}`;
  await sendVerificationEmail(email, verificationLink);
  await UserModel.updateLastVerificationEmailSent(email, now);
  res.json({ message: 'Verification email resent. Please check your inbox.' });
});

// Resend Reset Password Email
app.post('/api/resend-reset', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const user = await UserModel.findByEmail(email);
  if (!user) return res.status(400).json({ error: 'User not found' });
  if (!user.reset_token || !user.reset_token_expiry || user.reset_token_expiry < new Date()) {
    return res.status(400).json({ error: 'No valid reset token found. Please request a new password reset.' });
  }
  const lastSent = await UserModel.getLastResetEmailSent(email);
  const now = new Date();
  if (lastSent && now.getTime() - lastSent.getTime() < 60 * 1000) {
    const wait = 60 - Math.floor((now.getTime() - lastSent.getTime()) / 1000);
    return res.status(429).json({ error: `Please wait ${wait}s before resending.` });
  }
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${user.reset_token}`;
  await sendResetPasswordEmail(email, resetLink);
  await UserModel.updateLastResetEmailSent(email, now);
  res.json({ message: 'Password reset email resent. Please check your inbox.' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 