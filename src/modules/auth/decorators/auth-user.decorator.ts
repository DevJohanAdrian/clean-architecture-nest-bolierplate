import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator((data: string | null, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  if (!req.user) return null;
  return data ? req.user[data] : req.user;
});
