import { Controller, Get, Post, Body } from '@nestjs/common';
import { CatsService } from 'src/cats/services/cats.service';
import { CreateCatDto } from 'src/cats/dto/create-cat.dto';
import { Cat } from 'src/cats/types/interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
