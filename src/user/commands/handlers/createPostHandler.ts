import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostCommand } from './../implementations/createPostCommand';
import UserEntity from '../../../db/entities/User';
import PostEntity from '../../../db/entities/Post';
import CategoriesEntity from '../../../db/entities/Categories';
import { Repository } from 'typeorm';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(CategoriesEntity)
    private readonly categoryRepository: Repository<CategoriesEntity>,
  ) {}
  async execute(command: CreatePostCommand): Promise<any> {
    const { postDto, userDto } = command;

    const getCategories = async () => {
      const promises = postDto.categories.map(createCategories);
      const categories = await Promise.all(promises);
      return categories;
    };

    const createCategories = async (item: string) => {
      const existenCategory = await this.categoryRepository.findOne({
        where: {
          name: item,
        },
      });
      if (!existenCategory) {
        const category = this.categoryRepository.create({
          name: item,
        });
        await this.categoryRepository.save(category);
        return category;
      }
      return existenCategory;
    };

    const createdCategories = await getCategories();
    const newPost = this.postRepository.create({
      ...postDto,
      categories: createdCategories,
      author: userDto,
    });
    console.log(newPost);
    await this.postRepository.save(newPost);
    return newPost;
  }
}
