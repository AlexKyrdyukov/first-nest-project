import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshUserCommand } from "../implementations/refreshUserCommand";

@CommandHandler(RefreshUserCommand)
export class RefreshUserHandler implements ICommandHandler<RefreshUserCommand> {
  constructor() {}

  async execute(command: RefreshUserCommand): Promise<any> {
    
  }
}