import { PatchDataHandler } from './patchDataHandler';
import { PatchPasswordHandler } from './patchPasswordHandler';
import { RemoveUserHandler } from './removeUserHandler';
import { SetAvatarHandler } from './setAvatarhandler';
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
