import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { PasswordRecovery } from './entities/password-recovery.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PasswordRecoveryExternalRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async addPasswordRecoveryCode(dto: PasswordRecovery): Promise<string> {
    const [passwordRecovery]: PasswordRecovery[] = await this.dataSource.query(
      `INSERT INTO public.password_recoveries(user_id, recovery_code, expiration_date, is_used) VALUES ($1, $2, $3, $4) RETURNING id`,
      [dto.userId, dto.recoveryCode, dto.expirationDate, dto.isUsed],
    );

    return passwordRecovery.id;
  }

  async findPasswordRecoveryByCode(
    recoveryCode: string,
  ): Promise<PasswordRecovery> {
    const [passwordRecovery]: PasswordRecovery[] = await this.dataSource.query(
      `SELECT * FROM public.password_recoveries WHERE recovery_code = $1`,
      [recoveryCode],
    );

    if (!passwordRecovery) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'Code is invalid',
            field: 'code',
          },
        ],
      });
    }

    return passwordRecovery;
  }

  async markAsUsedById(userId: string): Promise<string> {
    const [passwordRecovery]: PasswordRecovery[] = await this.dataSource.query(
      `UPDATE public.password_recoveries SET is_used = true WHERE user_id = $1`,
      [userId],
    );

    // await passwordRecovery.save();

    return passwordRecovery.id.toString();
  }
}
