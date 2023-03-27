import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RemoveUserCommand } from '../implementations/removeUserCommand';
import UserEntity from '../../../db/entities/User';
import AddresEntity from '../../../db/entities/Address';

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
