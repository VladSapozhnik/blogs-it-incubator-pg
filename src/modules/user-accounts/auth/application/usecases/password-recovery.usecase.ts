import { generateId } from '../../../../../core/helpers/generate-id';
import { User } from '../../../users/entities/user.entity';
import { emailExamples } from '../../../../../core/adapters/email.examples';
import { UsersExternalRepository } from '../../../users/repositories/users.external.repository';
import { EmailAdapter } from '../../../../../core/adapters/email.adapter';
import { PasswordRecoveryExternalRepository } from '../../../password-recovery/password-recovery.external.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordRecovery } from '../../../password-recovery/entities/password-recovery.entity';

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
    const randomUUID: string = generateId();

    const existUser: User =
      await this.usersExternalRepository.findUserByEmail(email);

    if (existUser) {
      try {
        await this.emailAdapter.sendEmail(
          email,
          randomUUID,
          emailExamples.passwordRecovery,
        );

        const passwordRecovery: PasswordRecovery =
          PasswordRecovery.createForUser(existUser.id, randomUUID);

        await this.passwordRecoveryExternalRepository.savePasswordRecovery(
          passwordRecovery,
        );
      } catch (e) {
        console.log(e);
      }
    }
  }
}
