import { RequestHandler } from 'express';

export const notFound: RequestHandler = (req, res, next) => {
  res.status(404).json({ message: 'Not found' });
  next();
};
