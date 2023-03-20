import { DataSource } from 'typeorm';

import User from '../db/entities/User';

const authProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
];

export default authProviders;
