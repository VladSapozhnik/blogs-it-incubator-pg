import { UserDocument } from '../../../users/entities/user.entity';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { HttpStatus } from '@nestjs/common';
import { UsersExternalRepository } from '../../../users/repositories/users.external.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class ConfirmEmailCommand {
  constructor(public readonly code: string) {}
}

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailUseCase implements ICommandHandler<ConfirmEmailCommand> {
  constructor(
    private readonly usersExternalRepository: UsersExternalRepository,
  ) {}

  async execute({ code }: ConfirmEmailCommand): Promise<void> {
    const user: UserDocument | null =
      await this.usersExternalRepository.findUserByCode(code);

    if (!user) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'Invalid confirmation code',
            field: 'code',
          },
        ],
      });
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'Email already confirmed',
            field: 'code',
          },
        ],
      });
    }

    if (user.emailConfirmation.expirationDate < new Date()) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'Confirmation code expired',
            field: 'code',
          },
        ],
      });
    }

    user.confirmEmail();

    await this.usersExternalRepository.save(user);
  }
}
