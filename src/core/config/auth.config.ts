import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface IAuthConfig {
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

export default registerAs('auth', () => {
  // Our environment variables
  const values: IAuthConfig = {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  };

  // Joi validations
  const schema = Joi.object({
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().required().valid('1d', '7d', '30d'),
  });

  // Validates our values using the schema.
  const { error } = schema.validate(values, { abortEarly: false });

  if (error) {
    throw new Error(`Config validation error: ${error.message} in .env file`);
  }

  return values;
});
