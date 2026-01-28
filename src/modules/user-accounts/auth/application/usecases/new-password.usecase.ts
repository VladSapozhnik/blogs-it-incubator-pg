import { PasswordRecovery } from '../../../password-recovery/entities/password-recovery.entity';
import { User } from '../../../users/entities/user.entity';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { HttpStatus } from '@nestjs/common';
import { PasswordRecoveryExternalRepository } from '../../../password-recovery/password-recovery.external.repository';
import { HashAdapter } from '../../../../../core/adapters/hash.adapter';
import { UsersExternalRepository } from '../../../users/repositories/users.external.repository';
import { NewPasswordDto } from '../../dto/new-password.dto';
import { ICommandHandler } from '@nestjs/cqrs';

export class NewPasswordCommand {
  constructor(public readonly dto: NewPasswordDto) {}
}

export class NewPasswordUseCase implements ICommandHandler<NewPasswordCommand> {
  constructor(
    private readonly passwordRecoveryExternalRepository: PasswordRecoveryExternalRepository,
    private readonly usersExternalRepository: UsersExternalRepository,
    private readonly hashAdapter: HashAdapter,
  ) {}

  async execute({ dto }: NewPasswordCommand): Promise<void> {
    const passwordRecovery: PasswordRecovery =
      await this.passwordRecoveryExternalRepository.findPasswordRecoveryByCode(
        dto.recoveryCode,
      );

    if (
      passwordRecovery.isUsed ||
      passwordRecovery.expirationDate < new Date()
    ) {
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

    const newHash: string = await this.hashAdapter.hashPassword(
      dto.newPassword,
    );

    const existUser: User | null =
      await this.usersExternalRepository.getUserById(
        passwordRecovery.userId.toString(),
      );

    if (!existUser) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'Bad request',
            field: 'id',
          },
        ],
      });
    }

    await this.usersExternalRepository.updatePassword(existUser.id, newHash);

    await this.passwordRecoveryExternalRepository.markAsUsedById(existUser.id);
  }
}
