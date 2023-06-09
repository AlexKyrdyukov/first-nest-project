import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import UserEntity from '../../../db/entities/User';
import AddressEntity from '../../../db/entities/Address';

import { PatchDataCommand } from '../implementations/patchDataCommand';

@CommandHandler(PatchDataCommand)
export class PatchDataHandler implements ICommandHandler<PatchDataCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
  ) {}
  async execute(command: PatchDataCommand): Promise<any> {
    const { patchUserDto, user } = command;
    const { address, email, fullName } = patchUserDto;

    const newAddress = await this.addressRepository.save({
      ...user.address,
      ...address,
    });

    const newUser = await this.userRepository.save({
      ...user,
      email,
      fullName,
      address: newAddress,
    });

    const { password, ...returnedUser } = newUser;
    return returnedUser;
  }
}
