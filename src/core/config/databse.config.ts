import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface IDatabaseConfig {
  DATABASE_URL : string;
}

export default registerAs('database', () => {
  // Our environment variables
  const values: IDatabaseConfig = {
    DATABASE_URL: process.env.DATABASE_URL,
  };

  // Joi validations
  const schema = Joi.object({
    DATABASE_URL: Joi.string().required(),
  });

  // Validates our values using the schema.
  const { error } = schema.validate(values, { abortEarly: false });

  if (error) {
    throw new Error(`Config validation error: ${error.message} in .env file`);
  }

  return values;
});
