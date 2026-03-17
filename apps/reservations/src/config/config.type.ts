import { type ConfigType } from '@nestjs/config';

import type appConfig from './app.config';
import type databaseConfig from './database.config';
import type mailConfig from './mail.config';
import type storageConfig from './storage.config';
import jwtConfig from './jwt.config';

export interface RootConfig {
  reservations_app: ConfigType<typeof appConfig>;
  database: ConfigType<typeof databaseConfig>;
  jwt: ConfigType<typeof jwtConfig>;
  mail: ConfigType<typeof mailConfig>;
  storage: ConfigType<typeof storageConfig>;
}

export type AppConfig = ConfigType<typeof appConfig>;
export type DatabaseConfig = ConfigType<typeof databaseConfig>;
export type JwtConfig = ConfigType<typeof jwtConfig>;
export type MailConfig = ConfigType<typeof mailConfig>;
export type StorageConfig = ConfigType<typeof storageConfig>;
