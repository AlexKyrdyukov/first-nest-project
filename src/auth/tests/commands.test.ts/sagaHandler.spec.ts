import { Test, TestingModule } from '@nestjs/testing';
import { SagaTestHandler } from '../../../auth/commands/handlers/sagaTestHandler';

describe('check work saga', () => {
  let sagaHandler: SagaTestHandler;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SagaTestHandler],
    }).compile();
    sagaHandler = module.get(SagaTestHandler);
  });

  it('check work testing saga', async () => {
    const res = await sagaHandler.execute({
      name: 'Ivan',
      lastName: 'Ivan Ivanov',
    });
    expect(res).toBe('Ivan Ivanov');
  });
});
