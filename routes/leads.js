import express from 'express';
const router = express.Router();

import { enrichBatch } from '../services/enrichService.js';
import Lead from '../models/Lead.js';

router.post('/batch', async (req, res) => {
  try {
    const namesRaw = req.body.names;
    if (!namesRaw) return res.status(400).json({ error: 'names required' });

    const names = namesRaw.split(',')
      .map(x => x.trim())
      .filter(x => x.length > 0);

    if (names.length === 0) return res.status(400).json({ error: 'no valid names' });

    const saved = await enrichBatch(names);
    return res.json({ success: true, count: saved.length });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const leads = await Lead.find(filter)
    .sort({ createdAt: -1 })
    .limit(1000);

  res.json(leads);
});

export default router;
