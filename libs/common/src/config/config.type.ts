import { type ConfigType } from '@nestjs/config';

import type databaseConfig from './database.config';
import appConfig from './app.config';

export interface RootConfig {
  app: ConfigType<typeof appConfig>;
  database: ConfigType<typeof databaseConfig>;
}

export type DatabaseConfig = ConfigType<typeof databaseConfig>;
export type AppConfig = ConfigType<typeof appConfig>;
