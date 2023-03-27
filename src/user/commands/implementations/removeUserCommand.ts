import UserEntity from '../../../db/entities/User';

export class RemoveUserCommand {
  constructor(public readonly userDto: UserEntity) {}
}
