// import {
//   BadRequestException,
//   HttpException,
//   HttpStatus,
//   Injectable,
// } from '@nestjs/common';

// import { InjectRepository } from '@nestjs/typeorm';

// import { Repository } from 'typeorm';

// import UserService from '../user/service';
// import TokenService from '../token/service';
// import PostgresErrorCode from '../db/postgressErrorCodeEnum';
// import UserEntity from '../db/entities/User';
// import SignInUserDto from './dto/signInUserDto';
// import RefreshTokenDto, { DeviceIdDto } from './dto/refreshDto';

// interface DatabaseError {
//   code: PostgresErrorCode;
//   detail: string;
//   table: string;
//   column?: string;
// }

// @Injectable()
// class AuthService {
//   constructor(
//     private userService: UserService,
//     private tokenService: TokenService,
//     @InjectRepository(UserEntity)
//     private userRepository: Repository<UserEntity>,
//   ) {}

//   async signUp() {
//     return 'dlfjs';
//   }

//   isRecord(value: unknown): value is Record<string, unknown> {
//     return value !== null && typeof value === 'object' && !Array.isArray(value);
//   }

//   isDatabaseError(value: unknown): value is DatabaseError {
//     if (!this.isRecord(value)) {
//       return false;
//     }
//     const { code, detail, table } = value;
//     return Boolean(code && detail && table);
//   }

//   async refresh(dto: RefreshTokenDto, deviceId: DeviceIdDto['device_id']) {
//     const [auth, token] = dto.refreshToken?.split(' ');

//     if (!deviceId || !deviceId.length || auth !== 'Bearer') {
//       throw new HttpException(
//         'Unknown type authorization, please enter in application & repeat request',
//         HttpStatus.UNAUTHORIZED,
//       );
//     }
//     const { userId } = await this.tokenService.verifyRefresh(deviceId, token);

//     const { accessToken, refreshToken } = await this.tokenService.createTokens(
//       userId,
//       deviceId,
//     );

//     return {
//       accessToken,
//       refreshToken,
//     };
//   }
// }

// export default AuthService;
