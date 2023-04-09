import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import CryptoService from '../service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should create hash with unexpected string parametes', async () => {
    const result = await service.hashString('', '');
    expect(result).toBeDefined();
    expect(result).toHaveLength(128);
    expect(result).toBeTruthy();
  });

  it('should create hash with expected parametrs', async () => {
    const result = await service.hashString('password', 'password');
    expect(result).toBeDefined();
    expect(result).toHaveLength(128);
    expect(result).toBeTruthy();
  });

  it('should throw error hashing', async () => {
    await service
      .hashString(null as unknown as string, null as unknown as string)
      .catch((err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBeDefined();
      });
  });

  it('should create salt with negative integer parametrs', async () => {
    const result = await service.createSalt(-45);
    expect(result).toBeDefined();
    expect(result).toBeTruthy();
  });

  it('should create salt with the expected parametrs', async () => {
    const result = await service.createSalt(45);
    expect(result).toBeDefined();
    expect(result).toBeTruthy();
  });

  it('should throw error salting', async () => {
    await service.createSalt(-0).catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBeDefined();
    });
  });

  it('should check valid string dont throw Error', async () => {
    const hash =
      'b7902eed0114afa8bc848c0f9fd8c7cd20f2eb67344e8702ba6adf59d6f45e3d137b851adbcf416fa1a3a2a949ca013ba2f3f9b4a7fc63a1f2aad1045ef732d4';
    const result = await service.checkValid(hash, '123');
    expect(result).not.toBeDefined();
  });

  it('should throw error', async () => {
    await service.checkValid('invalid hash', '123').catch((err) => {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.status).toBe(400);
      expect(err.message).toBe('Entered password invalid');
    });
  });
});
