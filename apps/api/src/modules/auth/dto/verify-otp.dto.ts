import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { OtpPurpose } from '@/modules/otp/schema/otp.schema';

export class VerifyOtpDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  purpose: OtpPurpose;
}
