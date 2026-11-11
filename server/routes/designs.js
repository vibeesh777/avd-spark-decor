const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { missing, explain, uploadBuffer, removeByUrl } = require('../lib/cloud');
const { verifyAdmin } = require('../middleware/auth');
const store = require('../lib/store');

const getDesigns = (fresh = false) => store.read('designs', { fresh });
const saveDesigns = (designs) => store.write('designs', designs);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'));
  }
});

/** Upload files to Cloudinary, or throw an error that says what to fix. */
const uploadAll = async (files = []) => {
  if (!files.length) return [];
  const gaps = missing();
  if (gaps.length) {
    const e = new Error(`Photo storage (Cloudinary) is not set up on the server — missing ${gaps.join(', ')}.`);
    e.status = 503; throw e;
  }
  try {
    return await Promise.all(files.map((f) => uploadBuffer(f.buffer)));
  } catch (err) {
    const e = new Error(`Photo upload failed: ${explain(err)}`);
    e.status = 502; throw e;
  }
};
const fail = (res, err, fallback) =>
  res.status(err.status || 500).json({ success: false, message: err.status ? err.message : `${fallback}: ${err.message}` });

// GET all designs
router.get('/', async (req, res) => {
  try {
    const designs = await getDesigns(req.query.fresh === '1');   // the admin asks for the very latest list
    const { category } = req.query;
    const filtered = category && category !== 'All'
      ? designs.filter(d => d.category === category)
      : designs;
    res.json({ success: true, designs: filtered });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch designs' });
  }
});

// GET single design
router.get('/:id', async (req, res) => {
  try {
    const designs = await getDesigns();
    const design = designs.find(d => d.id === req.params.id);
    if (!design) return res.status(404).json({ success: false, message: 'Design not found' });
    res.json({ success: true, design });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch design' });
  }
});

// POST new design
router.post('/', verifyAdmin, upload.array('images', 10), async (req, res) => {
  try {
    const { title, category, description, price, tags } = req.body;
    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'Title and category required' });
    }
    const designs = await getDesigns(true);      // check storage first, so a failure never leaves orphan uploads
    const images = await uploadAll(req.files);
    const newDesign = {
      id: uuidv4(),
      title, category,
      description: description || '',
      price: price || 'Contact for pricing',
      tags: tags ? JSON.parse(tags) : [],
      images,
      featured: false,
      createdAt: new Date().toISOString()
    };
    designs.unshift(newDesign);
    await saveDesigns(designs);
    res.status(201).json({ success: true, design: newDesign });
  } catch (err) {
    fail(res, err, 'Could not save');
  }
});

// PUT update design
router.put('/:id', verifyAdmin, upload.array('images', 10), async (req, res) => {
  try {
    const designs = await getDesigns(true);
    const idx = designs.findIndex(d => d.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Design not found' });
    const { title, category, description, price, tags, featured, removeImages } = req.body;
    const toRemove = removeImages ? JSON.parse(removeImages) : [];
    const newImages = await uploadAll(req.files);
    designs[idx] = {
      ...designs[idx],
      title: title || designs[idx].title,
      category: category || designs[idx].category,
      description: description !== undefined ? description : designs[idx].description,
      price: price || designs[idx].price,
      tags: tags ? JSON.parse(tags) : designs[idx].tags,
      featured: featured !== undefined ? featured === 'true' : designs[idx].featured,
      images: [...designs[idx].images.filter(u => !toRemove.includes(u)), ...newImages],
      updatedAt: new Date().toISOString()
    };
    await saveDesigns(designs);
    await Promise.all(toRemove.map(removeByUrl));
    res.json({ success: true, design: designs[idx] });
  } catch (err) {
    fail(res, err, 'Could not update');
  }
});

// DELETE design
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    let designs = await getDesigns(true);
    const design = designs.find(d => d.id === req.params.id);
    if (!design) return res.status(404).json({ success: false, message: 'Design not found' });
    designs = designs.filter(d => d.id !== req.params.id);
    await saveDesigns(designs);
    await Promise.all((design.images || []).map(removeByUrl));
    res.json({ success: true, message: 'Design deleted' });
  } catch (err) {
    fail(res, err, 'Could not delete');
  }
});

// Friendly messages for upload problems raised by multer
router.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const msg = {
    LIMIT_FILE_SIZE: 'A photo is larger than 10 MB.',
    LIMIT_UNEXPECTED_FILE: 'Too many photos at once (maximum 10).',
  }[err.code] || err.message;
  res.status(err.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({ success: false, message: msg });
});

module.exports = router;