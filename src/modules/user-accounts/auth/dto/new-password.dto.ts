import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '../../../../core/decorators/trim.decorator';

export class NewPasswordDto {
  @Trim()
  @IsNotEmpty()
  @Length(6, 20)
  @IsString()
  newPassword: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  recoveryCode: string;
}
