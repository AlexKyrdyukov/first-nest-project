import { PatchPasswordCommand } from './../implementations/patchPassword';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(PatchPasswordCommand)
export class PatchPasswordHandler
  implements ICommandHandler<PatchPasswordCommand>
{
  // constructor() {}
  async execute(command: PatchPasswordCommand): Promise<any> {
    console.log('command', command);
    return command;
  }
}
