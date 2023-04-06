import { PatchDataHandler } from './patchDataHandler';
import { SetAvatarHandler } from './setAvatarhandler';
import { RemoveUserHandler } from './removeUserHandler';
import { PatchPasswordHandler } from './patchPasswordHandler';
import { CreatePostHandler } from '../../../post/commands/handlers/createPostHandler';
import { CreateCommentHandler } from '../../../comment/commands/handlers/createCommentHandler';

export const CommandHandlers = [
  PatchDataHandler,
  PatchPasswordHandler,
  RemoveUserHandler,
  SetAvatarHandler,
  CreatePostHandler,
  CreateCommentHandler,
];
