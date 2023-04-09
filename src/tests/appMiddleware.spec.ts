import { HttpException } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { Request, Response, NextFunction } from 'express';

import { appMiddleware } from '../app.middleware';

describe('check app Middleware', () => {
  const request: Request = createMock<Request>();
  const response: Response = createMock<Response>();
  let nextFunction: NextFunction = createMock<NextFunction>();

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should throw error "Unknown type request please enter in application and repeat request"', () => {
    const currentRequest = {
      ...request,
      headers: {},
    };
    try {
      appMiddleware(
        currentRequest as unknown as Request,
        response,
        nextFunction,
      );
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe(
        'Unknown type request please enter in application and repeat request',
      );
    }
  });

  it('should throw error if deviceId empty string ', () => {
    const currentRequest = {
      ...request,
      headers: {
        device_id: '',
      },
    };

    try {
      appMiddleware(
        currentRequest as unknown as Request,
        response,
        nextFunction,
      );
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe(
        'Unknown type request please enter in application and repeat request',
      );
    }
  });

  it('should throw error if deviceId type number ', () => {
    const currentRequest = {
      ...request,
      headers: {
        device_id: 1234566 as unknown as string,
      },
    };

    try {
      appMiddleware(
        currentRequest as unknown as Request,
        response,
        nextFunction,
      );
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe(
        'Unknown type request please enter in application and repeat request',
      );
    }
  });

  it('should call next function ', () => {
    const currentRequest = {
      ...request,
      headers: {
        device_id: '12345',
      },
    };

    nextFunction = jest.fn(() => true);

    try {
      const res = appMiddleware(
        currentRequest as unknown as Request,
        response,
        nextFunction,
      );
      expect(nextFunction).toHaveBeenCalled();
      expect(res).toBeUndefined();
      expect(nextFunction).toHaveReturnedWith(true);
    } catch (error) {
      console.log(error);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBeDefined();
    }
  });
});
