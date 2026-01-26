import { PasswordRecoveryDocument } from '../../../password-recovery/entities/password-recovery.entity';
import { UserDocument } from '../../../users/entities/user.entity';
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
    const passwordRecovery: PasswordRecoveryDocument =
      await this.passwordRecoveryExternalRepository.findPasswordRecoveryByCode(
        dto.recoveryCode,
      );

    passwordRecovery.validateRecoveryCode();

    const hash: string = await this.hashAdapter.hashPassword(dto.newPassword);

    const existUser: UserDocument | null =
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

    existUser.setPassword(hash);

    await this.usersExternalRepository.save(existUser);

    passwordRecovery.markAsUsed();

    await this.passwordRecoveryExternalRepository.markAsUsedById(
      passwordRecovery,
    );
  }
}
