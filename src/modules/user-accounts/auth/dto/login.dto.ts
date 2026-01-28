import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../../../core/decorators/trim.decorator';

export class LoginDto {
  @Trim()
  @IsNotEmpty()
  @IsString()
  loginOrEmail: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  password: string;
}
