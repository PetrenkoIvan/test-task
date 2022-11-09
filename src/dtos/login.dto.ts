import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  readonly userName: string;

  @IsNotEmpty()
  readonly password: string;
}
