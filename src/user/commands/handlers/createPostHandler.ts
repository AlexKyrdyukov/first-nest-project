import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import UserEntity from '../../../db/entities/User';
import PostEntity from '../../../db/entities/Post';
import CategoriesEntity from '../../../db/entities/Categories';
import { CreatePostCommand } from './../implementations/createPostCommand';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
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
      console.log(existenCategory);

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
    await this.postRepository.save(newPost);
    const { author, ...post } = newPost;
    return post;
  }
}
