import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT || 587),
  user: process.env.EMAIL_USER || '',
  password: process.env.EMAIL_PASSWORD || '',
  secure: process.env.EMAIL_SECURE === 'true',
  from: process.env.EMAIL_FROM || '',
}));
