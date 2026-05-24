 const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;
const { verifyAdmin } = require('../middleware/auth');
const axios = require('axios');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${process.env.JSONBIN_BIN_ID}`;
const JSONBIN_HEADERS = {
  'X-Master-Key': process.env.JSONBIN_API_KEY,
  'Content-Type': 'application/json'
};

const getDesigns = async () => {
  const res = await axios.get(JSONBIN_URL, { headers: JSONBIN_HEADERS });
  return res.data.record.designs || [];
};

const saveDesigns = async (designs) => {
  await axios.put(JSONBIN_URL, { designs }, { headers: JSONBIN_HEADERS });
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'));
  }
});

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'avd-spark-decor' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    ).end(buffer);
  });
};

// GET all designs
router.get('/', async (req, res) => {
  try {
    const designs = await getDesigns();
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
    const images = await Promise.all((req.files || []).map(f => uploadToCloudinary(f.buffer)));
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
    const designs = await getDesigns();
    designs.unshift(newDesign);
    await saveDesigns(designs);
    res.status(201).json({ success: true, design: newDesign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update design
router.put('/:id', verifyAdmin, upload.array('images', 10), async (req, res) => {
  try {
    const designs = await getDesigns();
    const idx = designs.findIndex(d => d.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Design not found' });
    const { title, category, description, price, tags, featured } = req.body;
    const newImages = await Promise.all((req.files || []).map(f => uploadToCloudinary(f.buffer)));
    designs[idx] = {
      ...designs[idx],
      title: title || designs[idx].title,
      category: category || designs[idx].category,
      description: description !== undefined ? description : designs[idx].description,
      price: price || designs[idx].price,
      tags: tags ? JSON.parse(tags) : designs[idx].tags,
      featured: featured !== undefined ? featured === 'true' : designs[idx].featured,
      images: newImages.length > 0 ? [...designs[idx].images, ...newImages] : designs[idx].images,
      updatedAt: new Date().toISOString()
    };
    await saveDesigns(designs);
    res.json({ success: true, design: designs[idx] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE design
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    let designs = await getDesigns();
    const design = designs.find(d => d.id === req.params.id);
    if (!design) return res.status(404).json({ success: false, message: 'Design not found' });
    designs = designs.filter(d => d.id !== req.params.id);
    await saveDesigns(designs);
    res.json({ success: true, message: 'Design deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;