import { SagaTestHandler } from './sagaTestHandler';
import { SignUpUserHandler } from './signUpUserHandler';
import { SignInUserHandler } from './signInUserHandler';
import { RefreshUserHandler } from './refreshUserHandler';

export const CommandHandlers = [
  SagaTestHandler,
  SignInUserHandler,
  SignUpUserHandler,
  RefreshUserHandler,
];
