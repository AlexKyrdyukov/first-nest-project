import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import UserEntity from '../../../db/entities/User';
import AddresEntity from '../../../db/entities/Address';

import { RemoveUserCommand } from '../implementations/removeUserCommand';

@CommandHandler(RemoveUserCommand)
export class RemoveUserHandler implements ICommandHandler<RemoveUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AddresEntity)
    private readonly addressRepository: Repository<AddresEntity>,
  ) {}

  async execute(command: RemoveUserCommand): Promise<any> {
    const { userDto } = command;
    const { address } = userDto;

    await this.userRepository.remove(userDto);
    await this.addressRepository.remove(address);
  }
}
