import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import * as setAvatarCommand from '../implementations/setAvatarCommand';
import UserEntity from '../../../db/entities/User';
import { Repository } from 'typeorm';

@CommandHandler(setAvatarCommand.SetAvatarCommand)
export class SetAvatarHandler
  implements ICommandHandler<setAvatarCommand.SetAvatarCommand>
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async execute(command: setAvatarCommand.SetAvatarCommand): Promise<any> {
    const { userDto, avatarLink } = command;
    const savedUser = await this.userRepository.save({
      ...userDto,
      avatar: avatarLink,
    });
    const { password, ...returnedUser } = savedUser;
    return returnedUser;
  }
}
