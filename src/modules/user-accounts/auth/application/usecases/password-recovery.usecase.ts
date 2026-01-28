import { generateId } from '../../../../../core/helpers/generate-id';
import { User } from '../../../users/entities/user.entity';
import { emailExamples } from '../../../../../core/adapters/email.examples';
import { UsersExternalRepository } from '../../../users/repositories/users.external.repository';
import { EmailAdapter } from '../../../../../core/adapters/email.adapter';
import { PasswordRecoveryExternalRepository } from '../../../password-recovery/password-recovery.external.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { add } from 'date-fns/add';

export class PasswordRecoveryCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase implements ICommandHandler<PasswordRecoveryCommand> {
  constructor(
    private readonly usersExternalRepository: UsersExternalRepository,
    private readonly passwordRecoveryExternalRepository: PasswordRecoveryExternalRepository,
    private readonly emailAdapter: EmailAdapter,
  ) {}

  async execute({ email }: PasswordRecoveryCommand): Promise<void> {
    const randomUUID = generateId();

    const existUser: User =
      await this.usersExternalRepository.findUserByEmail(email);

    if (existUser) {
      try {
        await this.emailAdapter.sendEmail(
          email,
          randomUUID,
          emailExamples.passwordRecovery,
        );

        await this.passwordRecoveryExternalRepository.addPasswordRecoveryCode(
          existUser.id,
          randomUUID,
          add(new Date(), { minutes: 30 }),
          false,
        );
      } catch (e) {
        console.log(e);
      }
    }
  }
}
