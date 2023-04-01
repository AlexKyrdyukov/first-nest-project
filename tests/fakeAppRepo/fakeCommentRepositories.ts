import CommentEntity from '../../src/db/entities/Comment';

export class CommentRepositoryFake {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public create(): Partial<{ comment: Partial<CommentEntity> }> {
    return {
      comment: {
        commentId: 1,
        content: 'comment content',
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async save(): Promise<void> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async remove(): Promise<void> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async findOne(): Promise<void> {}
}
