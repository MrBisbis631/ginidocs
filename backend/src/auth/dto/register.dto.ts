import { IsEmail, IsString, MinLength } from 'class-validator';
import { Confirm } from '../../common/validators/confirm.validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @Confirm('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}
