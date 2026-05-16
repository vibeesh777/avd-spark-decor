const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const adminPassword = process.env.ADMIN_PASSWORD || 'avd@admin2025';
    if (decoded.startsWith(`avd:${adminPassword}:`)) {
      return next();
    }
    return res.status(401).json({ success: false, message: 'Invalid token' });
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = { verifyAdmin };
