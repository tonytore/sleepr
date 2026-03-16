import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME,
  nodeEnv: process.env.NODE_ENV || 'production',
  port: Number(process.env.PORT || 4001),
  swaggerUser: process.env.SWAGGER_USER || 'admin',
  swaggerPassword: process.env.SWAGGER_PASSWORD || 'admin',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
}));
