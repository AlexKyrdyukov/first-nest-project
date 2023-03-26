import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import UserEntity from '../../../db/entities/User';
import { SignInUserCommand } from '../implementations/signInUserCommand';

@CommandHandler(SignInUserCommand)
export class SignInUserHandler implements ICommandHandler<SignInUserCommand> {
  constructor(private userRepository: Repository<UserEntity>) {}
  async execute(command: SignInUserCommand): Promise<any> {
    console.log(command);
  }
}
