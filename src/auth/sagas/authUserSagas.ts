import { SignUpUserHandler } from './../commands/handlers/signUpUserHandler';
import { delay, map } from 'rxjs/operators';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { SignedUpUserEvent } from '../events/implementations/signedUpUserEvent';
import { SagaTestCommand } from '../commands/implementations/sagaTestCommand';

export class AuthUserSagas {
  @Saga()
  signUpUser = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(SignUpUserHandler),
      delay(1000),
      map((event) => {
        console.log(event, 'userSignUpInApplication');
        return new SagaTestCommand('Ilon', 'Mask');
      }),
    );
  };
}
