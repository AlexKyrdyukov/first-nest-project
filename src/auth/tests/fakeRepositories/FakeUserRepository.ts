import UserEntity from '../../../db/entities/User';

export class UserRepositoryFake {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public create(): Partial<UserEntity> {
    return {
      userId: 1,
      email: 'user@mail.ru',
      password: '123',
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async save(): Promise<Partial<UserEntity>> {
    return {
      password: '123',
      email: 'user@mail.com',
      userId: 1,
      fullName: 'Ivan Ivanov',
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async remove(): Promise<void> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async findOne(): Promise<void> {}

  public createQueryBuilder = jest.fn(() => ({
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockReturnValue({
      userId: 2,
      email: 'tesst',
      address: {
        city: 'Moscow',
        country: 'Russia',
        street: 'Petrovskaya',
      },
    }),
  }));
}
