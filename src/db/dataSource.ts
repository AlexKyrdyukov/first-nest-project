import * as path from 'path';
import { DataSource } from 'typeorm';

import config from '../config';

const dataSource = new DataSource({
  type: 'postgres',
  host: config.postgres.dbHost,
  port: +config.postgres.dbPort,
  username: config.postgres.dbUser,
  password: config.postgres.dbPassword,
  database: config.postgres.dbName,
  logging: config.postgres.dbLogging,
  synchronize: false,
  subscribers: [],
  migrationsTableName: 'typeorm_migrations',
  entities: [path.normalize(`${__dirname}/entities/**/*.{ts,js}`)],
  migrations: [path.normalize(`${__dirname}/migrations/*.{ts,js}`)],
});

export default dataSource;
