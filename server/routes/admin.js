const express = require('express');
const router = express.Router();

// Simple password-based admin login
router.post('/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'avd@admin2025';
  if (password === adminPassword) {
    res.json({ success: true, token: Buffer.from(`avd:${adminPassword}:${Date.now()}`).toString('base64') });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

module.exports = router;
