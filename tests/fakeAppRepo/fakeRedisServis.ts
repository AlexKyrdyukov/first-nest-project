import { refreshToken } from '../fakeAppData/userData/userData';

export class FakeRedisService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async get(): Promise<string> {
    return refreshToken;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async set(): Promise<void> {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async remove(): Promise<void> {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async del(): Promise<void> {}

  public createKey(key: string, nestedKey: string): string {
    return `${key}:${nestedKey}`;
  }
}
