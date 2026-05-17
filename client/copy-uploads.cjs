// Script to copy server uploads to client dist during build
const fs = require('fs-extra');
const path = require('path');

const uploadsSource = path.join(__dirname, '../server/uploads');
const uploadsDest = path.join(__dirname, 'dist/uploads');

async function copyUploads() {
  try {
    // Ensure dist directory exists
    await fs.ensureDir(path.join(__dirname, 'dist'));

    // Copy uploads folder
    if (await fs.pathExists(uploadsSource)) {
      await fs.copy(uploadsSource, uploadsDest);
      console.log('✅ Copied uploads folder to dist/uploads');
    } else {
      console.log('⚠️  No uploads folder found at', uploadsSource);
    }
  } catch (err) {
    console.error('❌ Error copying uploads:', err);
    process.exit(1);
  }
}

copyUploads();
