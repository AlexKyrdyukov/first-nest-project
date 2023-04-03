import PostEntity from '../../src/db/entities/Post';

export class PostRepositoryFake {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public create() {
    return {
      postId: 1,
      content: 'post content',
      title: 'post title',
      comments: [],
      category: [{ categoryId: 1, name: 'footbal' }],
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async save() {
    return {
      author: {},
      post: {
        postId: 1,
        content: 'post content',
        title: 'post title',
        comments: [],
      },
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async remove(): Promise<void> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async findOne(): Promise<Partial<PostEntity> | null> {
    return {
      postId: 1,
      content: 'post content',
      title: 'post title',
      comments: [],
    };
  }
}
