import { GetAllPostDto } from '../../dto/getAllPostDto';

export class GetAllPostQuery {
  constructor(public readonly getAllPostDto: GetAllPostDto) {}
}
