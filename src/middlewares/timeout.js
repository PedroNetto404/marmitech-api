const {
  api: { routeTimeout },
  env,
} = require('../../config/env');

const timeout = (req, res, next) => {
  if (!routeTimeout || env === 'test' || env === 'development') {
    return next();
  }

  const timer = setTimeout(() => {
    if (res.headersSent) return;
    
    res.status(408).json({ message: 'Request Timeout' });
  }, routeTimeout || 30000);

  res.on('finish', () => clearTimeout(timer));

  next();
};

module.exports = timeout;
