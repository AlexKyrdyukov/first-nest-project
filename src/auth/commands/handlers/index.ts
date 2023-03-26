import { SagaTestHandler } from './sagaTestHandler';
import { SignUpUserHandler } from './signUpUserHandler';
import { SignInUserHandler } from './signInUserHandler';

export const CommandHandlers = [
  SagaTestHandler,
  SignInUserHandler,
  SignUpUserHandler,
];
