import path from 'path';
import fs from 'fs/promises';
import ApiError from '../errors/api-error';

export class ObjectStorageService {
  async upload({
    file,
    bucket = 'default',
    key,
  }: {
    file: Buffer;
    bucket?: string;
    key: string;
  }) {
    try {
      const bucketPath = path.join(__dirname, '../../static/buckets', bucket);
      const stat = await fs.stat(bucketPath);
      if (!stat.isDirectory()) {
        await fs.mkdir(bucketPath, { recursive: true });
      }

      const filePath = path.join(bucketPath, key);

      await fs.writeFile(filePath, file, { encoding: 'binary' });
    } catch (err) {
      console.error(err);
      throw ApiError.internal('Error uploading file');
    }
  }

  async download({
    bucket = 'default',
    key,
  }: {
    bucket?: string;
    key: string;
  }) {
    try {
      const filePath = path.join(
        __dirname,
        '../../static/buckets',
        bucket,
        key,
      );
      const file = await fs.readFile(filePath, { encoding: 'binary' });

      return file;
    } catch (err) {
      console.error(err);
      throw ApiError.internal('Error downloading file');
    }
  }
}
