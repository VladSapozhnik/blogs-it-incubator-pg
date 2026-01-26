import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = JwtPayload>(
    err: unknown,
    user: TUser | false,
  ): TUser | null {
    if (err || user === false || !user) {
      return null;
    }
    return user;
  }
}
