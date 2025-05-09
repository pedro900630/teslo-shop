import 'dotenv/config';
import * as Joi from 'joi';

interface EnvVars {
  PORT: number;
  DB_USER: string;
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_PASSWORD: string;
}

const envsSchema = Joi.object({
  PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_PASSWORD: Joi.string().required(),
}).unknown(true);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { error, value } = envsSchema.validate(process.env);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const envVars: EnvVars = value;

if (error) throw new Error(`Config validation error: ${error.message}`);

export const envs = {
  port: envVars.PORT,
  db_host: envVars.DB_HOST,
  db_user: envVars.DB_USER,
  db_name: envVars.DB_NAME,
  db_port: envVars.DB_PORT,
  db_password: envVars.DB_PASSWORD,
};
