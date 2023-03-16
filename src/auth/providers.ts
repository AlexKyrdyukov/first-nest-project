import UserService from 'src/user/service';
import { DataSource } from 'typeorm';

import User from '../db/entities/User';

const authProviders = [
  {
    provide: 'AUTH_REPOSITORY',
    useFactory: (userService: UserService) => userService,
    inject: ['USER_REPOSITORY'],
  },
];

export default authProviders;
