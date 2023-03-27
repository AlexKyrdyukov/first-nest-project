import { PatchDataDto } from '../../dto/patchDataDto';
import UserEntity from '../../../db/entities/User';

export class PatchDataCommand {
  constructor(
    public readonly patchUserDto: PatchDataDto,
    public readonly user: UserEntity,
  ) {}
}
