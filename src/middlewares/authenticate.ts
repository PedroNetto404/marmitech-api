import { RequestHandler } from 'express';
import { jwtService } from '../services/jwt-service';

export const authenticate: RequestHandler = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    res.status(401).json({ message: 'Token not provided' }).end();
    return;
  }

  const [type, value] = token.split(' ');
  if (type !== 'Bearer') {
    res.status(401).json({ message: 'Invalid token type' }).end();
    return;
  }

  try {
    const decoded = jwtService.verify(value);
    res.locals.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' }).end();
  }
};
