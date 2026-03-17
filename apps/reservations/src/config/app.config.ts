import { registerAs } from '@nestjs/config';

export default registerAs('reservations_app', () => ({
  name: process.env.APP_NAME,
  nodeEnv: process.env.NODE_ENV || 'production',
  http_port: Number(process.env.HTTP_PORT || 4001),
  tcp_port: Number(process.env.TCP_PORT || 4002),
  swaggerUser: process.env.SWAGGER_USER || 'admin',
  swaggerPassword: process.env.SWAGGER_PASSWORD || 'admin',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
}));
