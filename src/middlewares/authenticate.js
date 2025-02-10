const jwtService = require('../services/jwt-service');

const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  const [type, value] = token.split(' ');
  if (type !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid token type' });
  }

  try {
    const decoded = jwtService.verify(value);
    res.locals.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate;
