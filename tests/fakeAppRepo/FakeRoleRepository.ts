import RoleEntity from '../../src/db/entities/Role';

export class RoleRepositoryFake {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public create(): Partial<RoleEntity> {
    return {
      roleId: 1,
      name: 'admin',
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async save(): Promise<Partial<RoleEntity>> {
    return {
      roleId: 1,
      name: 'admin',
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async remove(): Promise<void> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async findOne(): Promise<Partial<RoleEntity> | null> {
    if (false) {
      return null;
    }
    return {
      roleId: 1,
      name: 'admin',
    };
  }
}
