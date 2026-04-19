import { Router } from 'express';
import Topic from '../models/Topic.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// All routes require auth
router.use(authMiddleware);

// GET /api/problems/topics — lightweight list for this user
router.get('/topics', async (req, res) => {
  try {
    const topics = await Topic.find({ userId: req.user.id }).lean();
    const lite = topics.map((t) => ({
      id: t._id,
      title: t.title,
      icon: t.icon,
      color: t.color,
      problems: t.problems.map(({ _id, title, difficulty, platform }) => ({
        id: _id, title, difficulty, platform,
      })),
    }));
    res.json(lite);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/problems/:id — full problem detail
router.get('/:id', async (req, res) => {
  try {
    const topic = await Topic.findOne({
      userId: req.user.id,
      'problems._id': req.params.id,
    }).lean();
    if (!topic) return res.status(404).json({ error: 'Not found' });
    const problem = topic.problems.find((p) => p._id.toString() === req.params.id);
    if (!problem) return res.status(404).json({ error: 'Not found' });
    res.json({ ...problem, id: problem._id, topicId: topic._id, topicTitle: topic.title });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/problems/topics — create topic
router.post('/topics', async (req, res) => {
  const { title, icon, color } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  try {
    const topic = await Topic.create({
      userId: req.user.id,
      title,
      icon: icon || '📝',
      color: color || 'navy',
      problems: [],
    });
    res.status(201).json({ id: topic._id, title: topic.title, icon: topic.icon, color: topic.color, problems: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/problems/topics/:id
router.delete('/topics/:id', async (req, res) => {
  try {
    const result = await Topic.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!result) return res.status(404).json({ error: 'Topic not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/problems/topics/:topicId/problems — add problem to topic
router.post('/topics/:topicId/problems', async (req, res) => {
  try {
    const topic = await Topic.findOne({ _id: req.params.topicId, userId: req.user.id });
    if (!topic) return res.status(404).json({ error: 'Topic not found' });
    topic.problems.push(req.body);
    await topic.save();
    const p = topic.problems[topic.problems.length - 1];
    res.status(201).json({ ...p.toObject(), id: p._id, topicId: topic._id, topicTitle: topic.title });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/problems/:id — remove problem
router.delete('/:id', async (req, res) => {
  try {
    const topic = await Topic.findOne({ userId: req.user.id, 'problems._id': req.params.id });
    if (!topic) return res.status(404).json({ error: 'Problem not found' });
    topic.problems.pull({ _id: req.params.id });
    await topic.save();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
