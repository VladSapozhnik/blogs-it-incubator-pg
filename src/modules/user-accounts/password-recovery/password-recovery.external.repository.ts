import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { PasswordRecovery } from './entities/password-recovery.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PasswordRecoveryExternalRepository {
  constructor(
    @InjectRepository(PasswordRecovery)
    private readonly passwordRecoveryRepository: Repository<PasswordRecovery>,
  ) {}

  async savePasswordRecovery(
    passwordRecovery: PasswordRecovery,
  ): Promise<string> {
    await this.passwordRecoveryRepository.save(passwordRecovery);

    return passwordRecovery.id;
  }

  async findPasswordRecoveryByCode(
    recoveryCode: string,
  ): Promise<PasswordRecovery> {
    const passwordRecovery: PasswordRecovery | null =
      await this.passwordRecoveryRepository.findOneBy({
        recoveryCode,
      });

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
}
