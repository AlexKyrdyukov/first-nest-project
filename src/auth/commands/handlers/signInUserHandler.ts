import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { SignInUserCommand } from '../implementations/signInUserCommand';
import CryptoService from '../../../crypto/service';
import TokenService from '../../../token/service';

import UserEntity from '../../../db/entities/User';
import { User } from '../../../auth/models/userModels';

@CommandHandler(SignInUserCommand)
export class SignInUserHandler implements ICommandHandler<SignInUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly crypto: CryptoService,
    private readonly tokenService: TokenService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: SignInUserCommand): Promise<any> {
    const { signInDto, deviceId } = command;
    const { email } = signInDto;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .leftJoinAndSelect('user.address', 'address')
      .leftJoinAndSelect('user.roles', 'roles')
      .getOne();

    if (!user) {
      throw new HttpException(
        'User with this email dont exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.crypto.checkValid(user.password, signInDto.password);

    const { accessToken, refreshToken } = await this.tokenService.createTokens(
      user.userId,
      deviceId,
    );

    const agregateUser = this.publisher.mergeObjectContext(
      new User(user.userId),
    );

    agregateUser.signIn(signInDto, deviceId);
    agregateUser.commit();

    const { password, ...existedUser } = user;
    return {
      user: existedUser,
      accessToken,
      refreshToken,
    };
  }
}
