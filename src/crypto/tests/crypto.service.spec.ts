import { BadRequestException, HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import CryptoModule from '../module';
import CryptoService from '../service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService, CryptoModule],
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
    const result = await service.hashString('22', '22');
    expect(result).toBeDefined();
    expect(result).toHaveLength(128);
    expect(result).toBeTruthy();
  });

  it('should function throw error', async () => {
    try {
      await service.hashString('null', 'null');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBeDefined();
    }
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

  it('should function throw error', async () => {
    try {
      await service.createSalt(-0);
    } catch (er) {
      expect(er).toBeInstanceOf(Error);
      expect(er.message).toBeDefined();
    }
  });

  it('should check valid string when valid string', async () => {
    const hash =
      'b7902eed0114afa8bc848c0f9fd8c7cd20f2eb67344e8702ba6adf59d6f45e3d137b851adbcf416fa1a3a2a949ca013ba2f3f9b4a7fc63a1f2aad1045ef732d4';
    const result = await service.checkValid(hash, '123');
    expect(result).not.toBeDefined();
  });

  it('should check valid string', async () => {
    try {
      const result = await service.checkValid('dsfs', '123');
      expect(() => {
        return result;
      }).toThrow();
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBeDefined();
    }
  });
});
