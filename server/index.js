require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('./middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 5000;
const isLocalOrigin = (o) =>
  /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(o);

app.set('trust proxy', 1); // correct client IP behind Vercel / proxies
app.disable('x-powered-by');

// CORS: set CLIENT_URL (comma-separated for several sites). Local network origins are allowed in dev.
const allowed = (process.env.CLIENT_URL || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowed.includes(origin) || (process.env.NODE_ENV !== 'production' && isLocalOrigin(origin))) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
}));

app.use((req, res, next) => {
  res.set({ 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'no-referrer' });
  next();
});
app.use(express.json({ limit: '100kb' }));

// Anti-guessing: 10 login attempts / 15 min per IP
app.use('/api/admin/login', rateLimit({ windowMs: 15 * 60_000, max: 10 }));

app.use('/api/designs', require('./routes/designs'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => res.json({ status: 'AVD Spark Decor API is running ✨' }));

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err.message);
  res.status(err.message === 'Not allowed by CORS' ? 403 : 500).json({ success: false, message: err.message });
});

if (process.env.VERCEL !== '1') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🌟 AVD Spark Decor server running → http://localhost:${PORT}/api/health\n`);
  });
}

module.exports = app;
