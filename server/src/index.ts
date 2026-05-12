import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { promptsRouter } from './routes/prompts';
import { paymentsRouter } from './routes/payments';
import { seedIfEmpty } from './db/seed';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/prompts', promptsRouter);
app.use('/api/payments', paymentsRouter);
app.get('/api/health', (_req, res) => res.json({ ok: true }));

seedIfEmpty().catch(console.error);

app.listen(PORT, () => {
  console.log(`\n🚀  PromptX server  →  http://localhost:${PORT}\n`);
});
