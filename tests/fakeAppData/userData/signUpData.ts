import { deviceId } from './userData';

export const signUpUserData = {
  signUpDto: {
    email: 'user@mail.com',
    password: '123',
    roles: ['admin'],
    address: {
      city: 'Moscow',
      country: 'Russia',
      street: 'Petrovskaya',
    },
  },
  deviceId,
};

export const fullUserFromdb = {
  userId: 1,
  password:
    'b7902eed0114afa8bc848c0f9fd8c7cd20f2eb67344e8702ba6adf59d6f45e3d137b851adbcf416fa1a3a2a949ca013ba2f3f9b4a7fc63a1f2aad1045ef732d4',
  createdDate: new Date('2023-04-01T12:18:06.046Z'),
  updatedDate: new Date('2023-04-01T12:18:06.046Z'),
  deletedDate: null,
  fullName: null,
  email: 'user@mail.ru',
  avatar: null,
  roles: [
    {
      roleId: 1,
      createdDate: '2023-03-27T17:37:55.572Z',
      name: 'admin',
    },
  ],
  address: {
    street: 'Lenina',
    city: 'Moscow',
    country: 'Russia',
    deletedDate: null,
    addresId: 1,
    createdDate: '2023-04-01T12:18:06.072Z',
    updatedDate: '2023-04-01T12:18:06.072Z',
  },
};

export const returnedUser = {
  user: {
    userId: 4,
    createdDate: new Date('2023-04-01T12:18:06.046Z'),
    updatedDate: new Date('2023-04-01T12:18:06.046Z'),
    deletedDate: null,
    fullName: null,
    email: 'user@mail.ru',
    avatar: null,
    roles: [
      {
        roleId: 1,
        createdDate: '2023-03-27T17:37:55.572Z',
        name: 'admin',
      },
    ],
  },
  address: {
    street: 'Lenina',
    city: 'Moscow',
    country: 'Russia',
    deletedDate: null,
    addresId: 7,
    createdDate: '2023-04-01T12:18:06.072Z',
    updatedDate: '2023-04-01T12:18:06.072Z',
  },
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTY4MDM1MTQ4NiwiZXhwIjoxNjgwMzUyNjg2fQ.7U3GO1ikl_5jFGUaSsbS7MyGOQtiRkrl_f2biTapV0s',
  refreshToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTY4MDM1MTQ4NiwiZXhwIjoxNjgwMzYyMjg2fQ.i9mSh144aJHV2CbRnH9EpHh_xrsAKMNK-3qs0xkeCfI',
};
