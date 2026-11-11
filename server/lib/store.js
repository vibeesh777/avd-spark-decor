// Tiny JSON store used by designs + requests.
//  • JSONBin when JSONBIN_API_KEY + a bin id are set (works on Vercel / any host)
//  • otherwise local files in /data (fine for running on your own PC / VPS)
// Reads are cached for a few seconds to stay fast and under JSONBin rate limits.
const path = require('path');
const fs = require('fs-extra');
const axios = require('axios');

const TTL_MS = 10_000;
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
const file = (name) => path.join(__dirname, '../data', `${name}.json`);

async function read(name) {
  const hit = cache[name];
  if (hit && Date.now() - hit.at < TTL_MS) return hit.list;

  let list;
  if (useBin(name)) {
    try {
      const { data } = await axios.get(`${binUrl(name)}/latest`, { headers: headers() });
      list = data.record?.[name] || [];
    } catch (e) { throw new Error(binProblem(e)); }
  } else {
    list = await fs.readJson(file(name)).then((d) => d[name] || []).catch(() => []);
  }
  cache[name] = { list, at: Date.now() };
  return list;
}

async function write(name, list) {
  if (useBin(name)) {
    try {
      await axios.put(binUrl(name), { [name]: list }, { headers: headers() });
    } catch (e) { throw new Error(binProblem(e)); }
  } else if (process.env.VERCEL === '1') {
    throw new Error(`No storage configured for "${name}". Set JSONBIN_API_KEY and the matching bin id.`);
  } else {
    await fs.outputJson(file(name), { [name]: list }, { spaces: 2 });
  }
  cache[name] = { list, at: Date.now() };
}

module.exports = { read, write, usesBin: useBin };
