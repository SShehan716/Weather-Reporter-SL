# Weather Reporter SL

A secure, modern, and user-centric weather reporting platform. Users can register, verify their email, reset passwords, submit and view weather/risk updates (with images), and manage their profiles—all with robust authentication and a responsive, mobile-friendly UI.

---

## Features

- **User Registration & Email Verification:**
  - Register with username, email, password, and country.
  - Verification email sent; only verified users can log in.
- **Secure Authentication:**
  - JWTs stored in httpOnly, secure cookies (not localStorage).
  - All sensitive routes protected by authentication middleware.
- **Password Reset:**
  - Request password reset via email; time-limited, single-use reset link.
  - Secure flow never reveals if an email is registered.
- **Login/Logout:**
  - Secure login/logout flows with clear feedback and session management.
- **Add Weather Updates & Risk Alerts:**
  - Authenticated users can submit general weather updates and risk alerts (e.g., floods, wildfires) for any location.
  - Risk alerts support image uploads (via Cloudinary).
- **Location-Based Search & Updates:**
  - Search for any city/country and view both general weather updates and risk alerts for that area.
  - Dashboard shows nearby updates.
- **User Profile Management:**
  - View and update profile (username, country).
- **Responsive UI:**
  - Mobile-first design with sidebar for desktop/tablet and bottom navigation for mobile.
  - All forms and cards optimized for usability.
- **UX Enhancements:**
  - Loaders for major actions (login, register, submissions).
  - Password fields have visibility toggles.

---

## Security & Best Practices

- **JWT in httpOnly Cookies:**
  - Prevents XSS token theft. Cookies set with `secure: true` and `sameSite: 'none'` in production.
  - `trust proxy` set for Heroku.
- **CORS Configuration:**
  - Backend CORS allows the exact frontend origin and credentials.
  - Heroku config vars used for dynamic origin.
- **CSRF Protection:**
  - Planned with recommendations for using `csurf` and exposing a CSRF token endpoint.
- **No Sensitive Data in localStorage:**
  - All authentication handled via cookies.
- **Email Security:**
  - Verification and password reset flows use secure, single-use, time-limited tokens.

---

## Project Structure

```
Weather-Reporter-SL/
  client/    # React frontend (Vercel)
  server/    # Node/Express/Prisma backend (Heroku)
```

- **Frontend:** React, TypeScript, mobile-first, deployed on Vercel.
- **Backend:** Node.js, Express, Prisma ORM, deployed on Heroku.
- **Database:** Managed via Prisma migrations.

---

## Deployment

- **Frontend:** Vercel
- **Backend:** Heroku
- **Environment Variables:** Set for each environment (see below).

---

## Environment Variables & Setup

### Client (`client/.env`)

```
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
REACT_APP_API_BASE_URL=https://your-backend-url.com
```

- `REACT_APP_GOOGLE_MAPS_API_KEY`: Google Maps JavaScript API key (enable Places API)
- `REACT_APP_CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name for image uploads
- `REACT_APP_API_BASE_URL`: The base URL of your backend (Heroku or local)

### Server (`server/.env`)

```
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
FRONTEND_URL=https://your-frontend-url.com
WEATHER_API_KEY=your_weatherapi_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for signing JWTs
- `EMAIL_USER`: Gmail address for sending verification/reset emails
- `EMAIL_APP_PASSWORD`: Gmail App Password (not your main password)
- `FRONTEND_URL`: The deployed frontend URL (for email links)
- `WEATHER_API_KEY`: API key from weatherapi.com
- `CLOUDINARY_*`: Cloudinary credentials for image uploads

---

## Setup & Usage

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL database

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/Weather-Reporter-SL.git
cd Weather-Reporter-SL
```

### 2. Install dependencies
```bash
cd client
npm install
cd ../server
npm install
```

### 3. Environment Variables
- Create `.env` files in both `client` and `server` folders as shown above.

### 4. Database Setup (Backend)
```bash
cd server
npx prisma migrate dev
```

### 5. Run Locally
- **Backend:**
  ```bash
  cd server
  npm run dev
  ```
- **Frontend:**
  ```bash
  cd client
  npm start
  ```

---

## Noteworthy Design Choices

- **Security-First:** All sensitive actions require authentication; app never leaks user existence.
- **User Experience:** Password visibility toggles, responsive loaders, and clear feedback.
- **Scalable API Structure:** Model-based DB access and middleware-protected routes.
- **Mobile-First Design:** UI adapts for both desktop and mobile users.

---

## Troubleshooting & Debugging

- **CORS & Cookies:**
  - Ensure frontend and backend origins are set correctly in environment variables.
  - Cookies must be set with `secure: true` and `sameSite: 'none'` for cross-origin in production.
  - Heroku requires `app.set('trust proxy', 1)` for secure cookies.
- **Email Delivery:**
  - Check SMTP configuration if verification or reset emails are not received.
- **Weather API Limitations:**
  - Some APIs may not provide all data (e.g., UV index on free plans).

---

## License

MIT 