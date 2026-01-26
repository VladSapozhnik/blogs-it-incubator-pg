import { generateId } from '../../../../../core/helpers/generate-id';
import { UserDocument } from '../../../users/entities/user.entity';
import {
  PasswordRecovery,
  PasswordRecoveryDocument,
  type PasswordRecoveryModel,
} from '../../../password-recovery/entities/password-recovery.entity';
import { emailExamples } from '../../../../../core/adapters/email.examples';
import { UsersExternalRepository } from '../../../users/repositories/users.external.repository';
import { InjectModel } from '@nestjs/mongoose';
import { EmailAdapter } from '../../../../../core/adapters/email.adapter';
import { PasswordRecoveryExternalRepository } from '../../../password-recovery/password-recovery.external.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class PasswordRecoveryCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase implements ICommandHandler<PasswordRecoveryCommand> {
  constructor(
    @InjectModel(PasswordRecovery.name)
    private readonly PasswordRecoveryModel: PasswordRecoveryModel,
    private readonly usersExternalRepository: UsersExternalRepository,
    private readonly passwordRecoveryExternalRepository: PasswordRecoveryExternalRepository,
    private readonly emailAdapter: EmailAdapter,
  ) {}

  async execute({ email }: PasswordRecoveryCommand): Promise<void> {
    const randomUUID = generateId();

    const existUser: UserDocument =
      await this.usersExternalRepository.findUserByEmail(email);

    if (existUser) {
      const recoveryData: PasswordRecoveryDocument =
        this.PasswordRecoveryModel.createForUser(existUser._id.toString());

      try {
        await this.emailAdapter.sendEmail(
          email,
          randomUUID,
          emailExamples.passwordRecovery,
        );

        await this.passwordRecoveryExternalRepository.addPasswordRecoveryCode(
          recoveryData,
        );
      } catch (e) {
        console.log(e);
      }
    }
  }
}
