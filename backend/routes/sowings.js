const express = require('express');
const multer = require('multer');
const path = require('path');
const Sowing = require('../models/sowing');
const Photo = require('../models/photo');

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// List all sowings
router.get('/', (req, res) => {
  const { status, q } = req.query;
  let sowings = Sowing.list({ status: status || undefined });

  if (q) {
    const query = q.toLowerCase();
    sowings = sowings.filter(s =>
      s.sowing_code.toLowerCase().includes(query) ||
      s.seed_name.toLowerCase().includes(query) ||
      (s.variety && s.variety.toLowerCase().includes(query))
    );
  }

  // Attach first packet photo as thumbnail
  sowings = sowings.map(s => {
    const photos = Photo.listBySowing(s.id);
    const packet = photos.find(p => p.photo_type === 'packet');
    return { ...s, thumbnail: packet ? packet.filename : null };
  });

  res.json(sowings);
});

// Get single sowing with photos
router.get('/:id', (req, res) => {
  const sowing = Sowing.getById(req.params.id);
  if (!sowing) return res.status(404).json({ error: 'Sowing not found' });

  const photos = Photo.listBySowing(sowing.id);
  res.json({ ...sowing, photos });
});

// Create sowing with optional photos
router.post('/', upload.fields([
  { name: 'packet_photo', maxCount: 1 },
  { name: 'tray_photo', maxCount: 1 },
]), (req, res) => {
  const { seed_name, variety, brand, sowing_date, notes } = req.body;

  if (!seed_name || !sowing_date) {
    return res.status(400).json({ error: 'seed_name and sowing_date are required' });
  }

  const sowing = Sowing.create({ seed_name, variety, brand, sowing_date, notes });

  if (req.files?.packet_photo?.[0]) {
    Photo.create({
      sowing_id: sowing.id,
      photo_type: 'packet',
      filename: req.files.packet_photo[0].filename,
    });
  }

  if (req.files?.tray_photo?.[0]) {
    Photo.create({
      sowing_id: sowing.id,
      photo_type: 'tray',
      filename: req.files.tray_photo[0].filename,
    });
  }

  const photos = Photo.listBySowing(sowing.id);
  res.status(201).json({ ...sowing, photos });
});

// Update sowing
router.patch('/:id', (req, res) => {
  const sowing = Sowing.getById(req.params.id);
  if (!sowing) return res.status(404).json({ error: 'Sowing not found' });

  const fields = {};
  const allowed = ['seed_name', 'variety', 'brand', 'sowing_date', 'germination_date', 'notes', 'status'];
  for (const key of allowed) {
    if (key in req.body) fields[key] = req.body[key];
  }

  // Auto-set germination_date when status changes to germinated
  if (fields.status === 'germinated' && !sowing.germination_date && !fields.germination_date) {
    fields.germination_date = new Date().toISOString().split('T')[0];
  }

  const updated = Sowing.update(req.params.id, fields);
  const photos = Photo.listBySowing(updated.id);
  res.json({ ...updated, photos });
});

// Delete sowing (soft)
router.delete('/:id', (req, res) => {
  const sowing = Sowing.getById(req.params.id);
  if (!sowing) return res.status(404).json({ error: 'Sowing not found' });

  Sowing.softDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
