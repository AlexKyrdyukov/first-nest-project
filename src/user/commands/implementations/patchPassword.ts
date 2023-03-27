import { PatchPasswordDto } from './../../dto/patchPassword.dto';
import UserEntity from '../../../db/entities/User';

export class PatchPasswordCommand {
  constructor(
    public readonly patchPasswordDto: PatchPasswordDto,
    public readonly user: UserEntity,
  ) {}
}
