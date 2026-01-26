import { IsNotEmpty, Length, IsString, Matches } from 'class-validator';
import { Trim } from '../../../../core/decorators/trim.decorator';

export class CreateUserDto {
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  // @Validate(IsLoginUnique, { message: 'login must be unique' })
  login: string;
  @Trim()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
  email: string;
}
