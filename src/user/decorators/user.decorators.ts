import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { request } from 'http';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const { user } = ctx.switchToHttp().getRequest();

  if (!user) {
    return null;
  }

  if (data) {
    return user[data];
  }

  return user;
});
