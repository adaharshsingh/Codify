import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google  — verify Google credential, upsert user, return JWT
router.post('/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: 'credential required' });

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { sub: googleId, name, email, picture } = ticket.getPayload();

    // Upsert user
    const user = await User.findOneAndUpdate(
      { googleId },
      { googleId, name, email, picture },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Sign JWT
    const token = jwt.sign(
      { id: user._id.toString(), googleId, name, email, picture },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    const isProd = process.env.NODE_ENV === 'production';
    res
      .cookie('codify_token', token, {
        httpOnly: true,
        sameSite: isProd ? 'none' : 'lax',
        secure: isProd,
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      })
      .json({ id: user._id, name, email, picture });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

// GET /api/auth/me — return user from cookie
router.get('/me', (req, res) => {
  const token = req.cookies?.codify_token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ id: user.id, name: user.name, email: user.email, picture: user.picture });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// POST /api/auth/logout
router.post('/logout', (_req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('codify_token', {
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    path: '/',
  }).json({ ok: true });
});

export default router;
