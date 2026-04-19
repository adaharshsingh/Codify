import { Router } from 'express';
import Progress from '../models/Progress.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

// GET /api/progress — all progress for logged-in user
router.get('/', async (req, res) => {
  try {
    const entries = await Progress.find({ userId: req.user.id }).lean();
    // Return as { [problemId]: { solved, starred, note } } for client compatibility
    const map = {};
    entries.forEach(({ problemId, solved, starred, note }) => {
      map[problemId] = { solved, starred, note };
    });
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/progress — upsert progress entry
// body: { problemId, solved?, starred?, note? }
router.post('/', async (req, res) => {
  const { problemId, solved, starred, note } = req.body;
  if (!problemId) return res.status(400).json({ error: 'problemId required' });

  const patch = {};
  if (solved  !== undefined) patch.solved  = solved;
  if (starred !== undefined) patch.starred = starred;
  if (note    !== undefined) patch.note    = note;

  try {
    const entry = await Progress.findOneAndUpdate(
      { userId: req.user.id, problemId },
      { $set: patch },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ ok: true, entry: { solved: entry.solved, starred: entry.starred, note: entry.note } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
