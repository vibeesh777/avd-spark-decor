// Cloudinary (photo storage) — config + helpers that explain problems in plain words.
const cloudinary = require('cloudinary').v2;

// Hosting dashboards often keep stray spaces or quotes around values — strip them.
const clean = (v) => String(v ?? '').trim().replace(/^["']|["']$/g, '');
const REQUIRED = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missing = () => REQUIRED.filter((k) => !clean(process.env[k]));

cloudinary.config({
  cloud_name: clean(process.env.CLOUDINARY_CLOUD_NAME),
  api_key: clean(process.env.CLOUDINARY_API_KEY),
  api_secret: clean(process.env.CLOUDINARY_API_SECRET),
  secure: true,
});

/** Turn a Cloudinary error into advice the owner can act on. */
const explain = (err) => {
  const msg = (err && (err.message || err.error?.message)) || String(err);
  if (/cloud_name/i.test(msg)) return 'the Cloudinary cloud name is wrong or missing (CLOUDINARY_CLOUD_NAME).';
  if (/signature/i.test(msg)) return 'the Cloudinary API secret is wrong (CLOUDINARY_API_SECRET).';
  if (/api[_ ]?key/i.test(msg)) return 'the Cloudinary API key is wrong (CLOUDINARY_API_KEY).';
  if (/ENOTFOUND|ECONN|ETIMEDOUT|EAI_AGAIN/i.test(msg)) return 'the server cannot reach Cloudinary (network problem).';
  if (/file size|too large/i.test(msg)) return 'a photo is too large for Cloudinary.';
  return msg;
};

const uploadBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: 'avd-spark-decor', resource_type: 'image' }, (error, result) =>
        error ? reject(error) : resolve(result.secure_url))
      .end(buffer);
  });

const ping = () => cloudinary.api.ping();

module.exports = { missing, explain, uploadBuffer, ping };
