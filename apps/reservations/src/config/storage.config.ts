import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY,
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
  bucket: process.env.S3_BUCKET || 'pscms',
  region: process.env.S3_REGION || 'us-east-1',
  maxFileSize:
    Number.parseFloat(process.env.MAX_FILE_SIZE || '10') * 1024 * 1024,
}));
