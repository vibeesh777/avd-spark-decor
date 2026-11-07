/** Minimal in-memory rate limiter (per IP). Enough to stop form spam / password guessing. */
module.exports = ({ windowMs, max }) => {
  const hits = new Map();
  setInterval(() => {
    const now = Date.now();
    for (const [ip, h] of hits) if (h.reset < now) hits.delete(ip);
  }, windowMs).unref();

  return (req, res, next) => {
    const now = Date.now();
    let h = hits.get(req.ip);
    if (!h || h.reset < now) { h = { n: 0, reset: now + windowMs }; hits.set(req.ip, h); }
    if (++h.n > max) {
      res.set('Retry-After', Math.ceil((h.reset - now) / 1000));
      return res.status(429).json({ success: false, message: 'Too many attempts. Please try again later.' });
    }
    next();
  };
};
