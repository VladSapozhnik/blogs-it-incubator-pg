import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../../../core/decorators/trim.decorator';

export class RegistrationConfirmationCodeDto {
  @Trim()
  @IsNotEmpty()
  @IsString()
  code: string;
}
