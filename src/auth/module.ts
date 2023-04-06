import { Repository } from 'typeorm';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import UserEntity from '../db/entities/User';
import { TypeOrmModule } from '@nestjs/typeorm';

import RoleEntity from '../db/entities/Role';
import AddressEntity from '../db/entities/Address';

import AuthController from './controllers';

import TokenModule from '../token/module';
import CryptoModule from '../crypto/module';
import { CommandHandlers } from './commands/handlers';
@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([UserEntity, AddressEntity, RoleEntity]),
    CryptoModule,
    TokenModule,
  ],
  controllers: [AuthController],
  providers: [...CommandHandlers, Repository],
})
export class AuthModule {}
