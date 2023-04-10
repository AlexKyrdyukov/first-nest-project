import PostEntity from '../../src/db/entities/Post';

export class PostRepositoryFake {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public create() {
    return {
      postId: 1,
      content: 'post content',
      title: 'post title',
      comments: [],
      category: 'football',
      categories: [{ categoryId: 1, name: 'footbal' }],
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

  public async findAndCount(): Promise<[Partial<PostEntity>[] | null, number]> {
    return [
      [
        {
          postId: 1,
          content: 'post content',
          title: 'post title',
        },
        {
          postId: 2,
          content: 'post content',
          title: 'post title',
        },
        {
          postId: 3,
          content: 'post content',
          title: 'post title',
        },
      ],
      3,
    ];
  }
}
