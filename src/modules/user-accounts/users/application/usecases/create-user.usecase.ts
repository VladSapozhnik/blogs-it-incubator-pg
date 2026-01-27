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
    await new Promise((resolve) => {
      resolve(dto);
    });
    // await this.usersRepository.findByLoginOrEmail(dto.login, dto.email);
    //
    // const hash: string = await this.hashAdapter.hashPassword(dto.password);
    //
    // const newUser = this.UserModel.createInstance(dto, hash, {
    //   confirmationCode: 'superAdmin',
    //   expirationDate: new Date(),
    //   isConfirmed: true,
    // });
    //
    // return this.usersRepository.createUser(newUser);

    return '123';
  }
}
