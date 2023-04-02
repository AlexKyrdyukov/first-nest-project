import { refreshToken } from '../fakeAppData/userData/userData';

export class FakeRedisService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async get(): Promise<string> {
    return refreshToken;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async set(): Promise<void> {}
}
