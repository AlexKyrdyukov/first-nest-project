import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SagaTestCommand } from '../implementations/sagaTestCommand';

@CommandHandler(SagaTestCommand)
export class SagaTestHandler implements ICommandHandler<SagaTestCommand> {
  async execute(command: SagaTestCommand): Promise<any> {
    console.log(command, 'work is test command');
  }
}
