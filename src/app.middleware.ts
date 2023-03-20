import { HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export const appMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { headers } = req;
    const deviceId = headers.device_id;
    if (!deviceId || !deviceId?.length) {
      throw new HttpException(
        'Unknown type request please enter in application and repeat request',
        HttpStatus.UNAUTHORIZED,
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};
