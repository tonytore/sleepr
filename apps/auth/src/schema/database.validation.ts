import * as Joi from 'joi';
export const AuthDatabaseValidation = Joi.object({
  APP_NAME: Joi.string().required(),
  NODE_ENV: Joi.string().required(),
  HTTP_PORT: Joi.number().required(),
  TCP_PORT: Joi.number().required(),
  SWAGGER_USER: Joi.string().required(),
  SWAGGER_PASSWORD: Joi.string().required(),

  DATABASE_URL: Joi.string().required(),
});
