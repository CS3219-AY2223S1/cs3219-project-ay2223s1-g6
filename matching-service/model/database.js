import { Sequelize } from 'sequelize';

const pgDatabase = process.env.PGDATABASE;
const pgUsername = process.env.PGUSER;
const pgPassword = process.env.PGPASSWORD;
const pgHost = process.env.PGHOST;
const pgPort = process.env.PGPORT;

export const db = new Sequelize(pgDatabase, pgUsername, pgPassword, {
  host: pgHost,
  dialect: 'postgres',
  port: pgPort,
});
