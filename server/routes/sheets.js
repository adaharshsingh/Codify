import { Router } from 'express';
import Sheet from '../models/Sheet.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

// GET /api/sheets — all sheets for logged-in user
router.get('/', async (req, res) => {
  try {
    const sheets = await Sheet.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    res.json(sheets.map((s) => ({ ...s, id: s._id })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sheets/:sheetId
router.get('/:sheetId', async (req, res) => {
  try {
    const sheet = await Sheet.findOne({ _id: req.params.sheetId, userId: req.user.id }).lean();
    if (!sheet) return res.status(404).json({ error: 'Sheet not found' });
    res.json({ ...sheet, id: sheet._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sheets — create sheet
router.post('/', async (req, res) => {
  const { name, description, emoji } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  try {
    const sheet = await Sheet.create({
      userId: req.user.id,
      name,
      description: description || '',
      emoji: emoji || '📝',
    });
    res.status(201).json({ ...sheet.toObject(), id: sheet._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/sheets/:sheetId
router.delete('/:sheetId', async (req, res) => {
  try {
    const result = await Sheet.findOneAndDelete({ _id: req.params.sheetId, userId: req.user.id });
    if (!result) return res.status(404).json({ error: 'Sheet not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
