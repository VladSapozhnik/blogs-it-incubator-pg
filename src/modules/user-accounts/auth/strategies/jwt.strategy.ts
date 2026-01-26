import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtPayload } from '../../../../core/types/jwt-payload.type';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { UserAccountsConfig } from '../../config/user-accounts.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userAccountsConfig: UserAccountsConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: userAccountsConfig.jwt_secret,
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    if (!payload.userId) {
      throw new DomainException({
        status: HttpStatus.UNAUTHORIZED,
        errorsMessages: [
          {
            message: 'Unauthorized',
            field: 'user',
          },
        ],
      });
    }

    return payload;
  }
}
