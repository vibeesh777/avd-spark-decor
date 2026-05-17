// Vercel Serverless Function Handler
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

// Import the Express app
const app = require('../server/index.js');

// Export as Vercel serverless function
module.exports = app;
