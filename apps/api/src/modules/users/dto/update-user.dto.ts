import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  isVerified?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  authProvider?: "local" | "google";
}

export class UpdateUserDto extends PartialType(UserDto) {
  @IsOptional()
  @IsObject()
  preferences?: {
    emailNotifications: boolean;
    language: string;
    timezone: string;
  };
}
