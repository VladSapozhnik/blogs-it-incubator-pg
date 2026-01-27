import { UsersRepository } from '../../repositories/users.repository';
import { HashAdapter } from '../../../../../core/adapters/hash.adapter';
import { CreateUserDto } from '../../dto/create-user.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

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
    await this.usersRepository.findByLoginOrEmail(dto.login, dto.email);

    const hash: string = await this.hashAdapter.hashPassword(dto.password);

    return this.usersRepository.createUser({ ...dto, password: hash });
  }
}
