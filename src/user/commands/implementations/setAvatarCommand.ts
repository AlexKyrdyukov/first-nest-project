import UserEntity from '../../../db/entities/User';

export class SetAvatarCommand {
  constructor(
    public readonly avatarLink: string,
    public readonly userDto: UserEntity,
  ) {}
}
