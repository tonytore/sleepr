import { ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';
import { REQUEST_USER_KEY } from '../../auth.constants';

export type UserAttachable = {
  [REQUEST_USER_KEY]?: JwtPayload;
};

export function getUserFromContext(
  context: ExecutionContext,
): JwtPayload | undefined {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest<UserAttachable>()[
      REQUEST_USER_KEY
    ];
  }

  if (context.getType() === 'rpc') {
    return context.switchToRpc().getData<UserAttachable>()?.[REQUEST_USER_KEY];
  }

  return undefined;
}
