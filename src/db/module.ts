// import { Module } from '@nestjs/common';
// import { databaseProviders } from '../db/providers';

// @Module({
//   providers: [...databaseProviders],
//   exports: [...databaseProviders],
// })
// class DatabaseModule {}

// export default DatabaseModule;

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { databaseProviders } from '../db/providers';
import * as path from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [path.normalize(`${__dirname}/entities/**/*.{ts,js}`)],
        synchronize: false,
        migrations: [path.normalize(`${__dirname}/migrations/*.{ts,js}`)],
        logging: false,
      }),
    }),
  ],
})
class DatabaseModule {}

export default DatabaseModule;
