// import dataSource from 'src/db/dataSourse';
import { DataSource } from 'typeorm';

import User from 'src/db/entities/User';

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
];
