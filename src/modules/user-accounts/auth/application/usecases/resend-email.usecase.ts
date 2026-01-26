import { add } from 'date-fns/add';
import { generateId } from '../../../../../core/helpers/generate-id';
import { UserDocument } from '../../../users/entities/user.entity';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { HttpStatus } from '@nestjs/common';
import { emailExamples } from '../../../../../core/adapters/email.examples';
import { UsersExternalRepository } from '../../../users/repositories/users.external.repository';
import { EmailAdapter } from '../../../../../core/adapters/email.adapter';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class ResendEmailCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(ResendEmailCommand)
export class ResendEmailUseCase implements ICommandHandler<
  ResendEmailCommand,
  void
> {
  constructor(
    private readonly usersExternalRepository: UsersExternalRepository,
    private readonly emailAdapter: EmailAdapter,
  ) {}

  async execute({ email }: ResendEmailCommand): Promise<void> {
    const newExpiration: Date = add(new Date(), { hours: 1, minutes: 30 });
    const newCode = generateId();

    const user: UserDocument =
      await this.usersExternalRepository.findUserByEmail(email);

    if (user.emailConfirmation.isConfirmed) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'Email already confirmed',
            field: 'email',
          },
        ],
      });
    }

    user.resendEmail(newCode, newExpiration);

    await this.usersExternalRepository.save(user);

    try {
      await this.emailAdapter.sendEmail(
        email,
        newCode,
        emailExamples.registrationEmail,
      );
    } catch (e) {
      console.log(e);
    }
  }
}
