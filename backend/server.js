import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectDB } from './src/config/db.js';
import subscribeRoutes from './src/routes/subscribe.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
}));

app.use('/api', subscribeRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

connectDB().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`✓ Server running on http://${HOST}:${PORT}`);
    console.log(`✓ Subscribe endpoint: POST http://${HOST}:${PORT}/api/subscribe`);
  });
});
