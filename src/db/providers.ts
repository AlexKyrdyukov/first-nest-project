import connectToDb from './connectTodb';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => connectToDb(),
  },
];
