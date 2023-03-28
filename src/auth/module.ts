import { EventHandlers } from './events/handlers/index';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from '../db/entities/User';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import AuthController from './controllers';
import { CommandHandlers } from './commands/handlers';
import { AuthUserSagas } from './sagas/authUserSagas';
import AddressEntity from '../db/entities/Address';
import { Repository } from 'typeorm';
import CryptoModule from '../crypto/module';
import TokenModule from '../token/module';
import RoleEntity from '../db/entities/Role';
@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([UserEntity, AddressEntity, RoleEntity]),
    CryptoModule,
    TokenModule,
  ],
  controllers: [AuthController],
  providers: [...CommandHandlers, AuthUserSagas, Repository, ...EventHandlers],
})
export class AuthModule {}
