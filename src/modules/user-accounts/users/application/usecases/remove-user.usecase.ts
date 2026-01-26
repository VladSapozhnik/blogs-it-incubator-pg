import { UserDocument } from '../../entities/user.entity';
import { UsersRepository } from '../../repositories/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class RemoveUserCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(RemoveUserCommand)
export class RemoveUserUseCase implements ICommandHandler<RemoveUserCommand> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({ id }: RemoveUserCommand): Promise<void> {
    const existUser: UserDocument = await this.usersRepository.getUserById(id);

    await this.usersRepository.removeUser(existUser);
  }
}
