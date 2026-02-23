import { UsersRepository } from '../../repositories/users.repository';
import { HashAdapter } from '../../../../../core/adapters/hash.adapter';
import { CreateUserDto } from '../../dto/create-user.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../../entities/user.entity';

export class CreateUserCommand {
  constructor(public readonly dto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashAdapter: HashAdapter,
  ) {}

  async execute({ dto }: CreateUserCommand): Promise<string> {
    await this.usersRepository.assertUserNotExists(dto.login, dto.email);

    const hash: string = await this.hashAdapter.hashPassword(dto.password);

    const user: User = User.createInstance(dto, hash, {
      expirationDate: new Date(),
      isConfirmed: true,
    });

    return await this.usersRepository.saveUser(user);
  }
}
