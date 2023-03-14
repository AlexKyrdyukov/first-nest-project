// import { Module, DynamicModule } from '@nestjs/common';
// import { createDatabaseProviders } from '.datavase/providers';
// import { Connection } from './connection.provider';

// @Module({
//   providers: [Connection],
// })
// export class DatabaseModule {
//   static forRoot(entities = [], options?): DynamicModule {
//     const providers = createDatabaseProviders(options, entities);
//     return {
//       global: true,
//       module: DatabaseModule,
//       providers,
//       exports: providers,
//     };
//   }
// }
