import { RegistrationDto } from '../../dto/registration.dto';
import { generateId } from '../../../../../core/helpers/generate-id';
import { User } from '../../../users/entities/user.entity';
import { add } from 'date-fns/add';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { HttpStatus } from '@nestjs/common';
import { emailExamples } from '../../../../../core/adapters/email.examples';
import { HashAdapter } from '../../../../../core/adapters/hash.adapter';
import { UsersExternalRepository } from '../../../users/repositories/users.external.repository';
import { EmailAdapter } from '../../../../../core/adapters/email.adapter';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserAccountsConfig } from '../../../config/user-accounts.config';

export class RegistrationCommand {
  constructor(public readonly dto: RegistrationDto) {}
}

@CommandHandler(RegistrationCommand)
export class RegistrationUseCase implements ICommandHandler<RegistrationCommand> {
  constructor(
    private readonly hashAdapter: HashAdapter,
    private readonly usersExternalRepository: UsersExternalRepository,
    private readonly emailAdapter: EmailAdapter,
    private readonly userAccountsConfig: UserAccountsConfig,
  ) {}

  async execute({ dto }: RegistrationCommand): Promise<void> {
    const isUser: User | null =
      await this.usersExternalRepository.getUserByLoginOrEmail(
        dto.login,
        dto.email,
      );

    if (isUser) {
      if (isUser.login === dto.login) {
        throw new DomainException({
          status: HttpStatus.BAD_REQUEST,
          errorsMessages: [
            {
              message: 'Login already exists',
              field: 'login',
            },
          ],
        });
      } else if (isUser.email === dto.email) {
        throw new DomainException({
          status: HttpStatus.BAD_REQUEST,
          errorsMessages: [
            {
              message: 'Email already exists',
              field: 'email',
            },
          ],
        });
      }
    }

    const hash: string = await this.hashAdapter.hashPassword(dto.password);

    const randomUUID: string = generateId();

    await this.usersExternalRepository.registration(dto, hash, {
      confirmationCode: randomUUID,
      expirationDate: add(new Date(), {
        hours: 1,
        minutes: 30,
      }),
      isConfirmed: this.userAccountsConfig.isUserConfirm,
    });

    try {
      await this.emailAdapter.sendEmail(
        dto.email,
        randomUUID,
        emailExamples.registrationEmail,
      );
    } catch (e) {
      console.log(e);
    }
  }
}
