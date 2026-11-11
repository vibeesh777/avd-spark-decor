// Where the photo list is saved (first one that is set up wins):
//  1. JSONBin      — if JSONBIN_API_KEY + JSONBIN_BIN_ID are set (optional, older setups)
//  2. Cloudinary   — if the 3 CLOUDINARY_* values are set (recommended: one account does everything)
//  3. Local file   — in /data (fine on your own PC / VPS, NOT on Vercel)
// Reads are cached briefly to stay fast and under the services' rate limits.
const path = require('path');
const fs = require('fs-extra');
const axios = require('axios');
const cloud = require('./cloud');

const TTL = { jsonbin: 10_000, file: 10_000, cloudinary: 60_000 };
const cache = {};
const binId = (name) => (name === 'designs' ? process.env.JSONBIN_BIN_ID : undefined);
const useBin = (name) => Boolean(process.env.JSONBIN_API_KEY && binId(name));
const binUrl = (name) => `https://api.jsonbin.io/v3/b/${binId(name)}`;
const headers = () => ({ 'X-Master-Key': process.env.JSONBIN_API_KEY, 'Content-Type': 'application/json' });
/** Plain-words explanation of a JSONBin failure. */
const binProblem = (e) => {
  const status = e.response?.status;
  if (status === 401 || status === 403) return 'JSONBin rejected the key — check JSONBIN_API_KEY (use the Master Key).';
  if (status === 404) return 'JSONBin bin not found — check JSONBIN_BIN_ID.';
  if (status === 400 || status === 422) return 'JSONBin bin is empty or invalid — it must contain {"designs": []}.';
  if (!e.response) return 'the server cannot reach JSONBin (network problem).';
  return `JSONBin error (${status}).`;
};
const mode = (name) => (useBin(name) ? 'jsonbin' : name === 'designs' && !cloud.missing().length ? 'cloudinary' : 'file');
const file = (name) => path.join(__dirname, '../data', `${name}.json`);

/** `fresh: true` skips the short cache — used before every change so edits never overwrite each other. */
async function read(name, { fresh = false } = {}) {
  const m = mode(name);
  const hit = cache[name];
  if (!fresh && hit && Date.now() - hit.at < TTL[m]) return hit.list;

  let list;
  if (m === 'jsonbin') {
    try {
      const { data } = await axios.get(`${binUrl(name)}/latest`, { headers: headers() });
      list = data.record?.[name] || [];
    } catch (e) { throw new Error(binProblem(e)); }
  } else if (m === 'cloudinary') {
    try { list = (await cloud.readJson())?.[name] || []; }
    catch (e) { throw new Error(`could not read the photo list from Cloudinary: ${cloud.explain(e)}`); }
  } else if (process.env.VERCEL === '1') {
    list = [];   // no disk on Vercel — the 'not set up' message is raised when saving
  } else {
    list = await fs.readJson(file(name)).then((d) => d[name] || []).catch(() => []);
  }
  cache[name] = { list, at: Date.now() };
  return list;
}

async function write(name, list) {
  const m = mode(name);
  if (m === 'jsonbin') {
    try {
      await axios.put(binUrl(name), { [name]: list }, { headers: headers() });
    } catch (e) { throw new Error(binProblem(e)); }
  } else if (m === 'cloudinary') {
    try { await cloud.writeJson({ [name]: list }); }
    catch (e) { throw new Error(`could not save the photo list to Cloudinary: ${cloud.explain(e)}`); }
  } else if (process.env.VERCEL === '1') {
    throw new Error('No place to save the photo list. Set up Cloudinary (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).');
  } else {
    await fs.outputJson(file(name), { [name]: list }, { spaces: 2 });
  }
  cache[name] = { list, at: Date.now() };
}

/** First-time setup check: creates the (empty) list if it does not exist yet, proving that saving works. */
async function ensure(name) {
  if (mode(name) === 'cloudinary') {
    let existing;
    try { existing = await cloud.readJson(); }
    catch (e) { throw new Error(`could not read the photo list from Cloudinary: ${cloud.explain(e)}`); }
    if (existing === null) await write(name, []);
  }
  return read(name, { fresh: true });
}

module.exports = { read, write, ensure, mode };
