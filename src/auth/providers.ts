// import UserService from 'src/user/service';
// import { DataSource } from 'typeorm';

// import User from '../db/entities/User';

// const authProviders = [
//   {
//     provide: 'AUTH_REPOSITORY',
//     useFactory: (userService: UserService) => userService,
//     inject: ['USER_REPOSITORY'],
//   },
// ];

// export default authProviders;

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
