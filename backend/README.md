# TechToolReviews Backend

Backend API server for TechToolReviews blog application built with Express.js and MongoDB.

## Features

- Email subscription management
- Weekly newsletter job
- MongoDB integration
- CORS support

## Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- SMTP server credentials (e.g., Gmail)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your configuration:
   - `PORT`: Server port (default: 5000)
   - `MONGO_URI`: MongoDB connection string
   - `SMTP_HOST`: SMTP server host
   - `SMTP_PORT`: SMTP server port
   - `SMTP_USER`: SMTP username
   - `SMTP_PASS`: SMTP password
   - `FROM_EMAIL`: Email address for sending emails

## Running the Application

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

### Send weekly email manually:
```bash
npm run send-weekly-email
```

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /api/subscribe` - Subscribe to newsletter

## Project Structure

```
backend/
├── src/
│   ├── config/       # Configuration files (database, etc.)
│   ├── jobs/         # Scheduled jobs (weekly email)
│   ├── models/       # MongoDB models
│   └── routes/       # API routes
├── server.js         # Main application entry point
├── package.json      # Dependencies and scripts
└── .env.example      # Environment variables template
```

## Setting Up as Separate Repository

If you want to set up this backend as a separate git repository:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Initialize a new git repository:
   ```bash
   git init
   ```

3. Add the remote repository:
   ```bash
   git remote add origin https://github.com/semipajollari/techtoolreviews-backend.git
   ```

4. Add all files and commit:
   ```bash
   git add .
   git commit -m "Initial commit: Backend API server"
   ```

5. Push to the remote repository:
   ```bash
   git push -u origin main
   ```

## License

See the main repository for license information.
