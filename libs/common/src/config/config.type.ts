import { type ConfigType } from '@nestjs/config';

import type databaseConfig from './database.config';

export interface RootConfig {
  database: ConfigType<typeof databaseConfig>;
}

export type DatabaseConfig = ConfigType<typeof databaseConfig>;
