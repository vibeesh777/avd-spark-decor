const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const { verifyAdmin } = require('../middleware/auth');

const DATA_FILE = path.join(__dirname, '../data/designs.json');

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeJsonSync(DATA_FILE, { designs: [] });
}

const getDesigns = () => fs.readJsonSync(DATA_FILE).designs;
const saveDesigns = (designs) => fs.writeJsonSync(DATA_FILE, { designs });

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `design_${uuidv4()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'));
  }
});

// GET all designs (public)
router.get('/', (req, res) => {
  try {
    const designs = getDesigns();
    const { category } = req.query;
    const filtered = category && category !== 'All'
      ? designs.filter(d => d.category === category)
      : designs;
    res.json({ success: true, designs: filtered });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch designs' });
  }
});

// GET single design (public)
router.get('/:id', (req, res) => {
  try {
    const designs = getDesigns();
    const design = designs.find(d => d.id === req.params.id);
    if (!design) return res.status(404).json({ success: false, message: 'Design not found' });
    res.json({ success: true, design });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch design' });
  }
});

// POST new design (admin only)
router.post('/', verifyAdmin, upload.array('images', 10), (req, res) => {
  try {
    const { title, category, description, price, tags } = req.body;
    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'Title and category required' });
    }
    const images = (req.files || []).map(f => `/uploads/${f.filename}`);
    const newDesign = {
      id: uuidv4(),
      title,
      category,
      description: description || '',
      price: price || 'Contact for pricing',
      tags: tags ? JSON.parse(tags) : [],
      images,
      featured: false,
      createdAt: new Date().toISOString()
    };
    const designs = getDesigns();
    designs.unshift(newDesign);
    saveDesigns(designs);
    res.status(201).json({ success: true, design: newDesign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update design (admin only)
router.put('/:id', verifyAdmin, upload.array('images', 10), (req, res) => {
  try {
    const designs = getDesigns();
    const idx = designs.findIndex(d => d.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Design not found' });
    const { title, category, description, price, tags, featured } = req.body;
    const newImages = (req.files || []).map(f => `/uploads/${f.filename}`);
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
    saveDesigns(designs);
    res.json({ success: true, design: designs[idx] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE design (admin only)
router.delete('/:id', verifyAdmin, (req, res) => {
  try {
    let designs = getDesigns();
    const design = designs.find(d => d.id === req.params.id);
    if (!design) return res.status(404).json({ success: false, message: 'Design not found' });
    // Delete image files
    design.images.forEach(imgPath => {
      const fullPath = path.join(__dirname, '..', imgPath);
      if (fs.existsSync(fullPath)) fs.removeSync(fullPath);
    });
    designs = designs.filter(d => d.id !== req.params.id);
    saveDesigns(designs);
    res.json({ success: true, message: 'Design deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
