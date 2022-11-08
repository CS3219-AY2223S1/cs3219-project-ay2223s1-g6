import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv'
import * as dotenvExpand from 'dotenv-expand'
dotenvExpand.expand(dotenv.config())
const pgDatabase = process.env.MATCHING_SERVICE_POSTGRES_DB;
const pgUsername = process.env.MATCHING_SERVICE_POSTGRES_USER;
const pgPassword = process.env.MATCHING_SERVICE_POSTGRES_PASSWORD;
const pgHost = process.env.MATCHING_SERVICE_POSTGRES_HOST;
const pgPort = process.env.MATCHING_SERVICE_POSTGRES_PORT;

export const db = new Sequelize(pgDatabase, pgUsername, pgPassword, {
  host: pgHost,
  dialect: 'postgres',
  port: pgPort,
});
