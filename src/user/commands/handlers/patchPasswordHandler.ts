import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import config from '../../../config';
import UserEntity from '../../../db/entities/User';
import CryptoService from '../../../crypto/service';

import { PatchPasswordCommand } from '../implementations/patchPasswordCommand';

@CommandHandler(PatchPasswordCommand)
export class PatchPasswordHandler
  implements ICommandHandler<PatchPasswordCommand>
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly cryptoService: CryptoService,
  ) {}

  async execute(command: PatchPasswordCommand): Promise<any> {
    const { patchPasswordDto, user } = command;
    const { password, newPassword } = patchPasswordDto;
    await this.cryptoService.checkValid(user.password, password);

    const newHash = await this.cryptoService.hashString(
      newPassword,
      config.hash.salt,
    );

    await this.userRepository.save({
      ...user,
      password: String(newHash),
    });
  }
}
