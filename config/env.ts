import dotenv from 'dotenv';
import path from 'path';

const envFilePath = path.resolve(__dirname, `../.env`);
dotenv.config({ path: envFilePath });

export const env = {
  env: process.env.NODE_ENV || 'development',
  api: {
    port: parseInt(process.env.API_PORT || '3000', 10),
    host: process.env.API_HOST || 'localhost',
    prefix: process.env.API_PREFIX || '/api',
    routeTimeout: parseInt(process.env.API_ROUTE_TIMEOUT || '10000', 10),
  },
  database: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'root',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    sync: {
      enabled: process.env.DB_SYNC_ENABLED === 'true',
      force: process.env.DB_SYNC_FORCE === 'true',
      alter: process.env.DB_SYNC_ALTER === 'true',
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    secondsToExpiry: parseInt(process.env.JWT_EXPIRY || '3600', 10),
    audience: process.env.JWT_AUDIENCE || 'localhost',
    issuer: process.env.JWT_ISSUER || 'localhost',
  },
  hashSalt: process.env.HASH_SALT || '$2a$10$JfDx9KJvK4T/1F7P/whieO',
  staticFilesUrl: `http://${process.API_HOST}:${process.API_PORT}/static`,
};
