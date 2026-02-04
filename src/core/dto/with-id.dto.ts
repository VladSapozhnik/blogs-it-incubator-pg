import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class WithIdDto {
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  id: string;
}
