import { PatchDataCommand } from './../implementations/patchData';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(PatchDataCommand)
export class PatchDataHandler implements ICommandHandler<PatchDataCommand> {
  // constructor() {}
  async execute(command: PatchDataCommand): Promise<any> {
    console.log(command);
    const { patchUserDto, user } = command;
    const { address, email, fullName } = patchUserDto;

    return command;
  }
}
