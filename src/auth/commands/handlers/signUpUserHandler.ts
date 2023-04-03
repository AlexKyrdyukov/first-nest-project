import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { SignUpUserCommand } from '../implementations/signUpUserCommand';
import config from '../../../config';
import UserEntity from '../../../db/entities/User';
import TokenService from '../../../token/service';
import RolesEntity from '../../../db/entities/Role';
import CryptoService from '../../../crypto/service';
import AddressEntity from '../../../db/entities/Address';
import { User } from '../../../auth/models/userModels';

@CommandHandler(SignUpUserCommand)
export class SignUpUserHandler implements ICommandHandler<SignUpUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
    @InjectRepository(RolesEntity)
    private rolesRepository: Repository<RolesEntity>,
    private crypto: CryptoService,
    private tokenService: TokenService,
    private publisher: EventPublisher,
  ) {}

  async execute(command: SignUpUserCommand): Promise<any> {
    const { signUpDto, deviceId } = command;
    const { address, ...user } = signUpDto;

    const exestingUser = await this.userRepository.findOne({
      where: {
        email: user.email,
      },
    });

    if (exestingUser) {
      throw new HttpException(
        'user with this email already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    const getRoles = async () => {
      const promises = user.roles.map(createRoles);
      const roles = await Promise.all(promises);
      return roles;
    };

    const createRoles = async (item: string) => {
      const existenRole = await this.rolesRepository.findOne({
        where: {
          name: item,
        },
      });
      if (!existenRole) {
        const role = this.rolesRepository.create({
          name: item,
        });
        await this.rolesRepository.save(role);
        return role;
      }
      return existenRole;
    };

    const createdRoles = await getRoles();
    const hashPassword = await this.crypto.hashString(
      user.password,
      config.hash.salt,
    );
    const createdUser = this.userRepository.create({
      ...user,
      roles: createdRoles,
      password: String(hashPassword),
    });
    await this.userRepository.save(createdUser);

    const newAddress = this.addressRepository.create({
      ...address,
      user: createdUser,
    });

    await this.addressRepository.save(newAddress);

    const { accessToken, refreshToken } = await this.tokenService.createTokens(
      createdUser.userId,
      deviceId,
    );

    const {
      user: { password, ...returnedUser },
      ...returnedAddress
    } = newAddress;

    const agreGateUser = this.publisher.mergeObjectContext(
      new User(createdUser.userId),
    );

    agreGateUser.signUp(signUpDto, deviceId);
    agreGateUser.commit();

    return {
      user: {
        ...returnedUser,
        address: returnedAddress,
      },
      accessToken,
      refreshToken,
    };
  }
}
