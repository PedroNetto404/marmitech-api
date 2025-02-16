const path = require('path');
const fs = require('fs/promises');
const ApiError = require('../errors/api-error');

module.exports.upload = async ({ file, bucket = 'default', key }) => {
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
};

module.exports.download = async ({ bucket = 'default', key }) => {
  try {
    const filePath = path.join(__dirname, '../../static/buckets', bucket, key);
    const file = await fs.readFile(filePath, { encoding: 'binary' });
    return file;
  } catch (err) {
    console.error(err);
    throw ApiError.internal('Error downloading file');
  }
};
