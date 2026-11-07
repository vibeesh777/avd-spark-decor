const express = require('express');
const { passwordOk, issueToken } = require('../middleware/auth');
const router = express.Router();

router.post('/login', (req, res) => {
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(503).json({ success: false, message: 'Admin login is not configured on the server' });
  }
  if (!passwordOk(req.body?.password)) {
    return res.status(401).json({ success: false, message: 'Invalid password' });
  }
  res.json({ success: true, token: issueToken() });
});

module.exports = router;
