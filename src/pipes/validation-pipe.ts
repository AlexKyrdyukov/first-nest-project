import {
  PipeTransform,
  Injectable,
  BadRequestException,
  Scope,
} from '@nestjs/common';

import { ObjectSchema } from 'joi';
@Injectable({ scope: Scope.REQUEST })
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any) {
    const { error } = this.schema.validate(value);

    if (error) {
      const errorMessages = error.details.map((item) => {
        const [, field, message] = item.message.split('"');
        return {
          [field]: message,
        };
      });
      throw new BadRequestException(errorMessages);
    }
    return value;
  }
}
