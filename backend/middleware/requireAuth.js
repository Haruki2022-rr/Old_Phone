module.exports = function requireAuth(req, res, next) {
    if (req.session && req.session.isAdmin) {
      return next();
    }
    return res.status(401).json({ message: 'Admin Authentication required' });
  };