module.exports = function requireUser(req, res, next){

if (req.session && req.session.userId) {
    req.user = { _id: req.session.userId };   // make it available downstream
    return next();
  }
  return res.status(401).json({ message: 'Login required' });
};