import { SignUpUserHandler } from './signUpUserHandler';
import { SignInUserHandler } from './signInUserHandler';
import { RefreshUserHandler } from './refreshUserHandler';

export const CommandHandlers = [
  SignInUserHandler,
  SignUpUserHandler,
  RefreshUserHandler,
];
