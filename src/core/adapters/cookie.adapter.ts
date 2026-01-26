import { Response } from 'express';
import { isProdHelper } from '../helpers/is-prod.helper';
import { UserAccountsConfig } from '../../modules/user-accounts/config/user-accounts.config';
import ms, { StringValue } from 'ms';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CookieAdapter {
  constructor(private readonly userAccountsConfig: UserAccountsConfig) {}

  setRefreshCookie(res: Response, token: string) {
    const refreshTokenMaxAge = ms(
      this.userAccountsConfig.refreshTokenExpires as StringValue,
    );

    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: isProdHelper(),
      maxAge: refreshTokenMaxAge,
      sameSite: 'strict',
    });
  }
  clearRefreshCookie(res: Response) {
    res.clearCookie('refreshToken');
  }
}
