import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
