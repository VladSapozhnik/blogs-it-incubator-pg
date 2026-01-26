import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JwtRefreshPayload } from '../types/jwt-payload.type';
import { DomainException } from '../exceptions/domain-exceptions';
import { UserAccountsConfig } from '../../modules/user-accounts/config/user-accounts.config';

@Injectable()
export class JwtAdapter {
  private readonly jwt_secret_key: string;
  private readonly jwt_refresh_secret_key: string;
  private readonly jwt_expires_in: string;
  private readonly jwt_refresh_expires_in: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userAccountsConfig: UserAccountsConfig,
  ) {
    this.jwt_secret_key = this.userAccountsConfig.jwt_secret;
    this.jwt_refresh_secret_key = this.userAccountsConfig.jwtRefreshSecret;
    this.jwt_expires_in = this.userAccountsConfig.accessTokenExpires;
    this.jwt_refresh_expires_in = this.userAccountsConfig.refreshTokenExpires;
  }

  async createAccessToken(userId: string): Promise<string> {
    try {
      return this.jwtService.signAsync(
        {
          userId: userId.toString(),
        },
        {
          secret: this.jwt_secret_key,
          expiresIn: this.jwt_expires_in as JwtSignOptions['expiresIn'],
        },
      );
    } catch {
      throw new DomainException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        errorsMessages: [
          {
            message: 'Token generation failed',
            field: 'token',
          },
        ],
      });
    }
  }
  async createRefreshToken(userId: string, deviceId: string): Promise<string> {
    try {
      return this.jwtService.signAsync(
        { userId: userId.toString(), deviceId: deviceId },
        {
          secret: this.jwt_refresh_secret_key,
          expiresIn: this.jwt_refresh_expires_in as JwtSignOptions['expiresIn'],
        },
      );
    } catch {
      throw new DomainException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        errorsMessages: [
          {
            message: 'Token generation failed',
            field: 'refresh token',
          },
        ],
      });
    }
  }
  // verifyAccessToken(jwtToken: string): string | null {
  //   try {
  //     const result: any = verify(jwtToken, this.jwt_secret_key);
  //     return result.userId.toString();
  //   } catch {
  //     return null;
  //   }
  // }
  async verifyRefreshToken(token: string): Promise<JwtRefreshPayload> {
    try {
      return this.jwtService.verifyAsync(token, {
        secret: this.jwt_refresh_secret_key,
      });
    } catch {
      throw new DomainException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        errorsMessages: [
          {
            message: 'Token verify failed',
            field: 'refresh token',
          },
        ],
      });
    }
  }
}
