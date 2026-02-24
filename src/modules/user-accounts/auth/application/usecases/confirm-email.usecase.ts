import { User } from '../../../users/entities/user.entity';
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
    const user: User = await this.usersExternalRepository.findUserByCode(code);

    user.confirmEmail();

    await this.usersExternalRepository.saveUser(user);
  }
}
