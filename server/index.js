import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __root = join(dirname(fileURLToPath(import.meta.url)), '..');
config({ path: join(__root, '.env') });
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './db.js';
import problemsRouter from './routes/problems.js';
import progressRouter from './routes/progress.js';
import sheetsRouter   from './routes/sheets.js';
import fetchRouter    from './routes/fetch.js';
import authRouter     from './routes/auth.js';

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Fix for Google GSI: Allow communication between opener and popup
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

app.use('/api/auth',         authRouter);
app.use('/api/problems',     problemsRouter);
app.use('/api/progress',     progressRouter);
app.use('/api/sheets',       sheetsRouter);
app.use('/api/fetch-problem', fetchRouter);

app.get('/', (_req, res) => res.send('Codify API is running...'));
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

connectDB().then(() =>
  app.listen(PORT, () =>
    console.log(`\n🚀  Codify server → http://localhost:${PORT}\n`)
  )
);
