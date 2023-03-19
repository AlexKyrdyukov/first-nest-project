import {
  PipeTransform,
  Injectable,
  BadRequestException,
  Scope,
  ArgumentMetadata,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';
// import * as _ from 'lodash';

// type ValidationShemaType = {
//   [key: string]: Joi.StringSchema | Joi.NumberSchema | Joi.DateSchema;
// };

// type ValidationType = {
//   body?: ValidationShemaType;
//   query?: ValidationShemaType;
//   params?: ValidationShemaType;
// };

@Injectable({ scope: Scope.REQUEST })
export class JoiValidationPipe implements PipeTransform {
  // constructor(private schema: ObjectSchema) { }
  constructor(
    private schema: ObjectSchema,
    // @Inject(REQUEST) protected readonly request: Request,
  ) { }
  transform(value: any, metadata: ArgumentMetadata) {
    // console.log(value, metadata);
    // const errors: Array<{
    //   path: string;
    //   message?: string;
    //   key?: string;
    // }> = [];

    // const rootShape: Record<string, Joi.AnySchema> = {};

    // const keysRequest = {
    //   // body: Object.keys(this.request.body),
    //   // params: Object.keys(this.request.params),
    //   // query: Object.keys(this.request.query),
    // };

    // Object.entries(this.schema).forEach(([key, value]) => {
    //   const arr = keysRequest[key as keyof typeof keysRequest];
    //   const diff = _.difference(arr, Object.keys(value));
    //   if (diff.length) {
    //     diff.forEach((item) => {
    //       errors.push({
    //         key: item,
    //         path: key,
    //         message: 'please delete entered field',
    //       });
    //     });
    //   }
    //   rootShape[key] = Joi.object(value);
    // });

    // const joiSchema = Joi.object(rootShape);
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
