import { Repository } from 'typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignUpUserCommand } from '../implementations/signUpUserCommand';
import UserEntity from '../../../db/entities/User';
import AddressEntity from '../../../db/entities/Address';
import CryptoService from '../../../crypto/service';

@CommandHandler(SignUpUserCommand)
export class SignUpUserHandler implements ICommandHandler<SignUpUserCommand> {
  constructor(
    private userRepository: Repository<UserEntity>,
    private addressRepository: Repository<AddressEntity>,
    private crypto: CryptoService,
  ) {}

  async execute(command: SignUpUserCommand): Promise<any> {
    const a = command;
    console.log('command :::::', a.signUpDto);
  }
}
