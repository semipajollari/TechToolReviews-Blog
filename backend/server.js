import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectDB } from './src/config/db.js';
import subscribeRoutes from './src/routes/subscribe.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use('/api', subscribeRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ Network: http://192.168.1.49:${PORT}`);
    console.log(`✓ Subscribe endpoint: POST http://localhost:${PORT}/api/subscribe`);
  });
});
