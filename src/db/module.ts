import { Module } from '@nestjs/common';
import { databaseProviders } from '../db/providers';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
class DatabaseModule {}

export default DatabaseModule;
