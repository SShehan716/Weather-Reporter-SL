# Environment Variables Setup

## Required Environment Variables

Create a `.env` file in the `client` directory with the following variables:

```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:5001/api

# Frontend Configuration  
REACT_APP_FRONTEND_URL=http://localhost:3000
```

## Important Notes

1. **REACT_APP_ Prefix**: All environment variables in Create React App must be prefixed with `REACT_APP_`
2. **No Quotes**: Don't wrap the values in quotes unless they contain spaces
3. **Restart Required**: After creating or modifying the `.env` file, restart your development server
4. **Git Ignore**: The `.env` file should already be in `.gitignore` to keep sensitive data out of version control

## Usage

The environment variables are accessed through:
- `process.env.REACT_APP_API_BASE_URL`
- `process.env.REACT_APP_FRONTEND_URL`

Or through the centralized config file: `src/config.ts`

## Production

For production, you'll want to set different values:
```env
REACT_APP_API_BASE_URL=https://your-api-domain.com/api
REACT_APP_FRONTEND_URL=https://your-frontend-domain.com
``` 