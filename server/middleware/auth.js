const crypto = require('crypto');

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const secret = () => process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || '';
const sign = (data) => crypto.createHmac('sha256', secret()).update(data).digest('base64url');
const sha = (s) => crypto.createHash('sha256').update(String(s)).digest();

/** True only if ADMIN_PASSWORD is configured AND matches (timing-safe). */
const passwordOk = (input) => {
  const pw = process.env.ADMIN_PASSWORD;
  return Boolean(pw) && crypto.timingSafeEqual(sha(input ?? ''), sha(pw));
};

/** Signed, expiring token — never contains the password. */
const issueToken = () => {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + TOKEN_TTL_MS })).toString('base64url');
  return `${payload}.${sign(payload)}`;
};

const verifyAdmin = (req, res, next) => {
  const refuse = (message) => res.status(401).json({ success: false, message });
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return refuse('Please log in again.');
  if (!secret()) return refuse('Admin login is not configured on the server (ADMIN_PASSWORD).');

  const [payload, sig] = token.split('.');
  try {
    if (!payload || !sig) return refuse('Your login is from an older version — please log in again.');
    const expected = Buffer.from(sign(payload));
    const given = Buffer.from(sig);
    if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) {
      return refuse('Your login is no longer valid (the server password changed) — please log in again.');
    }
    if (JSON.parse(Buffer.from(payload, 'base64url').toString()).exp <= Date.now()) {
      return refuse('Your login has expired — please log in again.');
    }
    return next();
  } catch {
    return refuse('Your login is from an older version — please log in again.');
  }
};

module.exports = { verifyAdmin, passwordOk, issueToken };
