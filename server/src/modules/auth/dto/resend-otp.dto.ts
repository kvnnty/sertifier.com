import { IsEmail, IsEnum } from 'class-validator';

export enum OtpPurpose {
  EMAIL_VERIFICATION = 'email_verification',
  LOGIN = 'login_verification',
  PASSWORD_RESET = 'password_reset',
  EMAIL_CHANGE = 'email_change',
}

export class ResendOtpDto {
  @IsEmail()
  email: string;

  @IsEnum(OtpPurpose)
  purpose: OtpPurpose;
}
