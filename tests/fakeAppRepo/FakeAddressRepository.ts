import AddressEntity from '../../src/db/entities/Address';

export class AddressRepositoryFake {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public create() {
    return {
      addresId: 1,
      city: 'Moscow',
      country: 'Russia',
      street: 'Petrovskaya',
      user: {
        userId: 1,
        email: 'user@mail.ru',
        password: '123',
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async save(): Promise<void> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async remove(): Promise<void> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async findOne(): Promise<Partial<AddressEntity>> {
    return {
      addresId: 1,
      city: 'Moscow',
      country: 'Russia',
      street: 'Petrovskaya',
    };
  }
}
