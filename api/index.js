// Vercel Serverless Function Handler
// This file acts as a serverless function entry point for /api routes

const app = require('../server/index.js');

// Export the Express app as a serverless function handler
module.exports = (req, res) => {
  // Vercel passes the request to this handler
  return app(req, res);
};
