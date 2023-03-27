import { Repository } from 'typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignUpUserCommand } from '../implementations/signUpUserCommand';
import UserEntity from '../../../db/entities/User';
import AddressEntity from '../../../db/entities/Address';
import CryptoService from '../../../crypto/service';
import config from '../../../config';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import TokenService from '../../../token/service';
import RolesEntity from '../../../db/entities/Role';

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
  ) { }

  async execute(command: SignUpUserCommand): Promise<any> {
    const { signUpDto, deviceId } = command;
    const { address, ...user } = signUpDto;

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
    const createdRoles = await getRoles();
    const hashPassword = await this.crypto.hashString(
      user.password,
      config.hash.salt,
    );
    const newUser = this.userRepository.create({
      ...user,
      roles: createdRoles,
      password: String(hashPassword),
    });

    await this.userRepository.save(newUser);

    const newAddress = this.addressRepository.create({
      ...address,
      user: newUser,
    });
    await this.addressRepository.save(newAddress);
    const { accessToken, refreshToken } = await this.tokenService.createTokens(
      newUser.userId,
      deviceId,
    );
    const {
      user: { password, ...returnedUser },
      ...returnedAddress
    } = newAddress;
    return {
      user: returnedUser,
      address: returnedAddress,
      accessToken,
      refreshToken,
    };
  }
}
