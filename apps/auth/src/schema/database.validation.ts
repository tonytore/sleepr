import * as Joi from 'joi';
export const AuthDatabaseValidation = Joi.object({
  APP_NAME: Joi.string().required(),
  NODE_ENV: Joi.string().required(),
  PORT: Joi.number().required(),

  SWAGGER_USER: Joi.string().required(),
  SWAGGER_PASSWORD: Joi.string().required(),

  DATABASE_URL: Joi.string().required(),
});
