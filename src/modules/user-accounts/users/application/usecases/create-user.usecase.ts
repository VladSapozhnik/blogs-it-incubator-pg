import {
  User,
  UserDocument,
  type UserModelType,
} from '../../entities/user.entity';
import { UsersRepository } from '../../repositories/users.repository';
import { HashAdapter } from '../../../../../core/adapters/hash.adapter';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../../dto/create-user.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreateUserCommand {
  constructor(public readonly dto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectModel(User.name) private readonly UserModel: UserModelType,
    private readonly usersRepository: UsersRepository,
    private readonly hashAdapter: HashAdapter,
  ) {}

  async execute({ dto }: CreateUserCommand): Promise<string> {
    await this.usersRepository.findByLoginOrEmail(dto.login, dto.email);

    const hash: string = await this.hashAdapter.hashPassword(dto.password);

    const newUser: UserDocument = this.UserModel.createInstance(dto, hash, {
      confirmationCode: 'superAdmin',
      expirationDate: new Date(),
      isConfirmed: true,
    });

    return this.usersRepository.createUser(newUser);
  }
}
