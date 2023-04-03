import CategoryEntity from '../../src/db/entities/Categories';

export class CategoryRepositoryFake {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public create(): Partial<CategoryEntity> {
    return {
      categoryId: 1,
      name: 'footbal',
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async save(): Promise<void> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async remove(): Promise<void> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async findOne(): Promise<Partial<CategoryEntity> | null> {
    // if (false) {
    // return null;
    // }
    return {
      categoryId: 1,
      name: 'footbal',
    };
  }
}
