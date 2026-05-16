require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure data directories exist
fs.ensureDirSync(path.join(__dirname, 'data'));
fs.ensureDirSync(path.join(__dirname, 'uploads'));

// Middleware — allow all local network origins (any device on same WiFi)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const isLocal = /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(origin);
    if (isLocal) return callback(null, true);
    if (origin === process.env.CLIENT_URL) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/designs', require('./routes/designs'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'AVD Spark Decor API is running ✨' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🌟 AVD Spark Decor Server running on port ${PORT}`);
  console.log(`   Local:   http://localhost:${PORT}/api/health`);
  console.log(`   Network: Open from any device on the same WiFi\n`);
});
