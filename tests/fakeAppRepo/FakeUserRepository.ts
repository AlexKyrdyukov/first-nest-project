import { returnedUser } from '../../tests/fakeAppData/userData/signUpData';
export class UserRepositoryFake {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public create() {
    const {
      accessToken,
      refreshToken,
      user: { ...userData },
      address: { ...addressData },
    } = returnedUser;
    return {
      ...userData,
      address: addressData,
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async save() {
    const {
      accessToken,
      refreshToken,
      user: { ...userData },
      address: { ...addressData },
    } = returnedUser;
    return {
      ...userData,
      address: addressData,
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async remove(): Promise<void> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async findOne() {
    if (false) {
      return null;
    }
    const {
      accessToken,
      refreshToken,
      user: { ...userData },
      address,
    } = returnedUser;
    return {
      ...userData,
      address,
    };
  }

  public createQueryBuilder = jest.fn(() => ({
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockReturnValue(returnedUser),
  }));
}
