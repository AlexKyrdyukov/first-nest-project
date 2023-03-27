import { delay, map } from 'rxjs/operators';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { SignedUpUserEvent } from '../events/implementations/signedUpUserEvent';
import { SagaTestCommand } from '../commands/implementations/sagaTestCommand';
import { SignedInUserEvent } from '../events/implementations/signedInUserEvent';

export class AuthUserSagas {
  @Saga()
  signUpUser = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(SignedUpUserEvent),
      delay(1000),
      map((event) => {
        console.log(event, ' <= event user SignUp InApplication');
        return new SagaTestCommand('Ilon', 'Mask');
      }),
    );
  };
  @Saga()
  signInUser = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(SignedInUserEvent),
      delay(5000),
      map((event) => {
        console.log(event, ' <= event userSignUpInApplication');
        return new SagaTestCommand(`${event}`, 'SignIn Event');
      }),
    );
  };
}
