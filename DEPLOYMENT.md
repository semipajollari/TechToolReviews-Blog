# Deployment Guide

This document explains how to deploy the TechToolReviews application to Vercel and ensure it works correctly on both desktop and mobile devices.

## Environment Configuration

### Frontend Environment Variables

Create a `.env` file in the root directory:

```bash
# API URL - Use /api for Vercel deployment, http://localhost:5000/api for local dev with separate backend
VITE_API_URL=/api

# Gemini API Key for AI features
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB Connection (for Vercel serverless functions)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/techtoolreviews?retryWrites=true&w=majority
```

### Backend Environment Variables (for standalone backend)

If running the backend separately (in `backend/` directory):

```bash
PORT=5000
HOST=0.0.0.0
CORS_ORIGIN=*
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/techtoolreviews?retryWrites=true&w=majority
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@techtoolreviews.com
```

## Architecture

### Vercel Deployment (Recommended)

The application is configured to run on Vercel with:

1. **Frontend**: Static React app built with Vite
2. **Backend API**: Serverless functions in `/api` directory
   - `/api/subscribe.js` - Newsletter subscription endpoint
   - `/api/subscribers.js` - Subscriber management

### Local Development

For local development with the full stack:

1. **Frontend** (port 3000):
   ```bash
   npm run dev
   ```

2. **Backend** (port 5000) - if running separately:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

   Set `VITE_API_URL=http://localhost:5000/api` in your `.env` file.

## Deployment Steps

### 1. Prepare for Deployment

Ensure all environment variables are set in Vercel dashboard:
- `VITE_API_URL=/api`
- `GEMINI_API_KEY=<your-key>`
- `MONGODB_URI=<your-connection-string>`

### 2. Build Verification

Test the build locally:
```bash
npm run build
npm run preview
```

### 3. Deploy to Vercel

Connect your GitHub repository to Vercel and deploy. Vercel will automatically:
- Build the frontend using `npm run build`
- Deploy serverless functions from `/api` directory
- Set up HTTPS and CDN

### 4. Mobile Testing

After deployment, test on mobile devices:
1. Open the deployed URL on a mobile browser
2. Test the newsletter subscription form
3. Verify error messages display correctly
4. Check that success messages appear after submission

## Network Configuration

### CORS Settings

The backend is configured to accept requests from any origin in production. For tighter security, update `backend/server.js`:

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://yourdomain.com',
  credentials: true,
}));
```

### API URL Resolution

The frontend automatically uses the correct API URL based on environment:
- **Production (Vercel)**: Uses `/api` (same origin, serverless functions)
- **Development**: Uses `import.meta.env.VITE_API_URL` from `.env` file

## Troubleshooting

### Mobile Connection Errors

**Problem**: "Connection error" on mobile devices
**Solution**: Ensure `VITE_API_URL` is set to `/api` (not localhost)

### CORS Errors

**Problem**: CORS errors in browser console
**Solution**: Verify CORS configuration in backend and API functions

### Build Failures

**Problem**: Build fails on Vercel
**Solution**: Check that all dependencies are in `package.json` and build command is `npm run build`

### API Not Found (404)

**Problem**: `/api/subscribe` returns 404
**Solution**: Ensure `/api/subscribe.js` exists and is properly configured

## Security Considerations

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Use environment variables** for all secrets (API keys, database URLs)
3. **Enable HTTPS** - Vercel provides this automatically
4. **Rate limiting** - Consider adding rate limiting to API endpoints
5. **Input validation** - Email validation is implemented in the API layer

## Performance Optimization

1. **Static asset caching** - Configured automatically by Vercel
2. **Code splitting** - Vite handles this automatically
3. **Database connection pooling** - Configured in API serverless functions
4. **Image optimization** - Use Vercel's image optimization service

## Monitoring

Monitor your deployment using:
- Vercel Analytics - Track page views and performance
- Vercel Logs - View serverless function logs
- MongoDB Atlas Monitoring - Database performance and queries
