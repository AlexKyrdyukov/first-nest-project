import { PatchDataHandler } from './patchDataHandler';
import { PatchPasswordHandler } from './patchPasswordHandler';
import { RemoveUserHandler } from './removeUserHandler';
import { SetAvatarHandler } from './setAvatarhandler';
import { CreatePostHandler } from './createPostHandler';
import { CreateCommentHandler } from './createCommentHandler';

export const CommandHandlers = [
  PatchDataHandler,
  PatchPasswordHandler,
  RemoveUserHandler,
  SetAvatarHandler,
  CreatePostHandler,
  CreateCommentHandler,
];
