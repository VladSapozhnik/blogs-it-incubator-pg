import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../../../../core/types/jwt-payload.type';

export const User = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    return data ? user?.[data] : user;
  },
);
