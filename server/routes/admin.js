const express = require('express');
const { passwordOk, issueToken, verifyAdmin } = require('../middleware/auth');
const cloud = require('../lib/cloud');
const store = require('../lib/store');
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

/** Self-check shown at the top of the admin dashboard: lists anything that would make uploads fail. */
router.get('/status', verifyAdmin, async (req, res) => {
  const problems = [];

  const gaps = cloud.missing();
  if (gaps.length) {
    problems.push(`Photo storage (Cloudinary) is not set up — missing ${gaps.join(', ')}.`);
  } else {
    try { await cloud.ping(); }
    catch (e) { problems.push(`Cloudinary refused the connection: ${cloud.explain(e)}`); }
  }

  if (process.env.VERCEL === '1' && !store.usesBin('designs')) {
    problems.push('JSONBin is not set up (JSONBIN_API_KEY, JSONBIN_BIN_ID) — photos cannot be saved on this host.');
  } else {
    try { await store.read('designs'); }
    catch (e) { problems.push(`Saving the photo list failed: ${e.message}`); }
  }

  res.json({ success: true, ok: problems.length === 0, problems });
});

module.exports = router;
