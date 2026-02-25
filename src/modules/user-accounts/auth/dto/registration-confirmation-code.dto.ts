import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Trim } from '../../../../core/decorators/trim.decorator';

export class RegistrationConfirmationCodeDto {
  @Trim()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  code: string;
}
