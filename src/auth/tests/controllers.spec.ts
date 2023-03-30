import { BadRequestException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import AuthController from '../controllers';
import { CommandHandlers } from '../commands/handlers';
import TokenModule from '../../token/module';
import UserEntity from '../../db/entities/User';
import { getRepositoryToken } from '@nestjs/typeorm';

class UserRepositoryFake {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public create(): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async save(): Promise<void> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async remove(): Promise<void> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async findOne(): Promise<void> {}
}

describe('auth controller ', () => {
  let authController: AuthController;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: getRepositoryToken(UserEntity),
          useClass: UserRepositoryFake,
        },
      ],
      imports: [TokenModule],
    }).compile();
    authController = module.get<AuthController>(AuthController);
    // userRepository = module.get(getRepositoryToken(UserEntity));
    console.log(module);
  });

  it('check work controller', async () => {
    const newLocal = 'sdffdfsdf';
    console.log('1234', authController);
    try {
      await authController.signIn(
        { email: '', password: '' },
        { device_id: 'fdfdfdf' },
      );
    } catch (er) {
      expect(er).toBeInstanceOf(BadRequestException);
      expect(er.message).toBe(['']);
    }

  //   // const userRepoSaveSpy = jest.spyOn(userRepository, 'findOne').mockResolvedValue()
  //   // console.log(authController);
  //   // expect(
  //   //   authController.signIn(
  //   //     { email: 'dfdf', password: newLocal },
  //   //     { device_id: 'dfdfdfd' },
  //   //   ),
  //   // ).toBe({
  //   //   email: 'ddfdfdfd',
  //   // });
  // // });
  // // // beforeEach(async () => {
  // //   const moduleRef = await Test.createTestingModule({
  // //     controllers: [AuthController],
  // //     providers: [...CommandHandlers],
  // //   }).compile();
  // //   authController = moduleRef.get<AuthController>(AuthController)
  // // })
  // // describe('sign Up', () => {
  // //   it('should create user with tokens', async () => {

  // //   })
});
