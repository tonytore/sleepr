import { plainToInstance } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT: number;

  @IsString()
  APP_NAME: string;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  SWAGGER_USER: string;

  @IsString()
  SWAGGER_PASSWORD: string;

  @IsString()
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string;

  @IsString()
  REFRESH_TOKEN_SECRET: string;

  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string;

  @IsString()
  TOKEN_AUDIENCE: string;

  @IsString()
  TOKEN_ISSUER: string;

  @IsNumber()
  MAX_FAILED_LOGIN_ATTEMPT_PER_MINUTES: number;

  @IsNumber()
  LOCK_OUT_DURATION: number;

  @IsString()
  S3_ACCESS_KEY: string;

  @IsString()
  S3_SECRET_KEY: string;

  @IsUrl({ require_tld: false })
  S3_ENDPOINT: string;

  @IsString()
  S3_BUCKET: string;

  @IsString()
  S3_REGION: string;

  @IsNumber()
  MAX_FILE_SIZE: number;

  @IsString()
  EMAIL_HOST: string;

  @IsNumber()
  EMAIL_PORT: number;

  @IsString()
  EMAIL_USER: string;

  @IsString()
  EMAIL_PASSWORD: string;

  @IsString()
  EMAIL_SECURE: string;

  @IsEmail()
  EMAIL_FROM: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
