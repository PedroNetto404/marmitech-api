import { RequestHandler } from 'express';
import { env } from '../../config/env';
const {
  api: { routeTimeout },
  env: appEnv,
} = env;

export const timeout: RequestHandler = (req, res, next) => {
  if (!routeTimeout || appEnv === 'test' || appEnv === 'development') {
    return next();
  }

  const timer = setTimeout(() => {
    if (res.headersSent) return;

    res.status(408).json({ message: 'Request Timeout' }).end();
  }, routeTimeout || 30000);

  res.on('finish', () => clearTimeout(timer));

  next();
};
