import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { MailService } from '../mail/mail.service';
import { OtpService } from '../otp/otp.service';
import { OtpPurpose } from '../otp/schema/otp.schema';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AuthResult, JwtPayload } from './types';

const OTP_CONFIG = {
  LENGTH: 5,
  EXPIRY_MINUTES: 15,
} as const;

const COOKIE_CONFIG = {
  MAX_AGE_MS: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

const EMAIL_SUBJECTS = {
  email_verification:
    'Welcome to Sertifier | Verify your email to complete your registration',
  login_verification: 'Sertifier | Welcome back',
  password_reset: 'Sertifier | Reset your password',
} as const;

const EMAIL_PURPOSES = {
  email_verification: 'email verification',
  login_verification: 'login verification',
  password_reset: 'password reset',
} as const;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<{ message: string }> {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException(
        'This email is already in use. Try another one or log in.',
      );
    }
    const user = await this.usersService.createNewUser({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: dto.password,
    });

    await this.sendOtpEmail(user, 'email_verification');

    return {
      message:
        'Your account has been created successfully. Please check your email to verify your account.',
    };
  }

  async login(loginDto: LoginDto): Promise<{ message: string }> {
    const user = await this.validateUserCredentials(
      loginDto.email,
      loginDto.password,
    );
    await this.sendOtpEmail(user, 'login_verification');

    return {
      message:
        'A verification code has been sent to your email. Please enter it to complete your login.',
    };
  }

  async googleOauth(profile: any, res: Response): Promise<AuthResult> {
    if (!profile) {
      throw new HttpException(
        'No user profile received from Google',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const user = await this.findOrCreateGoogleUser(profile);
    return this.buildAuthResult(user, res);
  }

  async verifyOtp(
    dto: VerifyOtpDto,
    res: Response,
  ): Promise<AuthResult | { message: string }> {
    const { email, code, purpose } = dto;

    const user = await this.findUserByEmail(email);
    await this.otpService.validateOtp(user.id, code, purpose);

    return this.handleOtpVerificationSuccess(user, purpose, res);
  }

  async logout(res: Response): Promise<void> {
    res.clearCookie('refreshToken');
  }

  async resendOtp(dto: ResendOtpDto): Promise<void> {
    const { email, purpose } = dto;
    const user = await this.findUserByEmail(email);

    if (user.isVerified && purpose === 'email_verification')
      throw new ForbiddenException('Account is already verified');

    await this.sendOtpEmail(user, purpose);
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.findUserByEmail(email);
    await this.sendOtpEmail(user, 'password_reset');

    return {
      message:
        'A verification code has been sent to your email. Please enter it to reset your password',
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const { email, newPassword } = dto;
    const user = await this.findUserByEmail(email);

    await this.usersService.updatePassword(user.id, newPassword);

    return {
      message:
        'Password has been reset successfully. You can now login with your new password.',
    };
  }

  async refreshTokens(
    req: Request,
    res: Response,
  ): Promise<{ accessToken: string }> {
    const refreshToken = this.extractRefreshToken(req);
    const payload = await this.verifyRefreshToken(refreshToken);

    const user = await this.findUserById(payload.sub);
    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(user);

    this.setRefreshTokenCookie(res, newRefreshToken);

    return { accessToken };
  }

  private async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<UserDocument> {
    const user = await this.usersService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }

  private async findOrCreateGoogleUser(profile: any): Promise<UserDocument> {
    const existingUser = await this.usersService.findByEmail(profile.email);

    if (existingUser) {
      return existingUser;
    }

    return this.usersService.createNewUser({
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      profileImage: profile.profileImage,
      authProvider: 'google',
      isVerified: true,
    });
  }

  private async findUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('This account does not exist');
    }
    return user;
  }

  private async findUserById(id: string): Promise<UserDocument> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new UnauthorizedException('This account does not exist');
    }
    return user;
  }

  private async sendOtpEmail(
    user: UserDocument,
    purpose: OtpPurpose,
  ): Promise<void> {
    const code = await this.otpService.generateOtp(
      user.id,
      purpose,
      OTP_CONFIG.LENGTH,
      OTP_CONFIG.EXPIRY_MINUTES,
    );

    await this.mailService.sendTemplateEmail(
      user.email,
      EMAIL_SUBJECTS[purpose],
      'otp-verification',
      {
        firstName: user.firstName,
        lastName: user.lastName,
        purpose: EMAIL_PURPOSES[purpose],
        verificationCode: code,
        expiry: OTP_CONFIG.EXPIRY_MINUTES,
      },
    );
  }

  private async handleOtpVerificationSuccess(
    user: UserDocument,
    purpose: OtpPurpose,
    res: Response,
  ): Promise<AuthResult | { message: string }> {
    switch (purpose) {
      case 'email_verification':
        if (!user.isVerified) {
          user = await this.usersService.markEmailAsVerified(user.id);
        }
        return this.buildAuthResult(user, res);

      case 'login_verification':
        return this.buildAuthResult(user, res);

      case 'password_reset':
        return {
          message: 'Verification complete. You may now reset your password.',
        };

      default:
        throw new BadRequestException('Invalid verification code purpose');
    }
  }

  private async buildAuthResult(
    user: UserDocument,
    res: Response,
  ): Promise<AuthResult> {
    await this.usersService.updateLastLogin(user.id);

    const { accessToken, refreshToken } = await this.generateTokens(user);
    this.setRefreshTokenCookie(res, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified,
        profileImage: user.profileImage,
      },
      accessToken,
    };
  }

  private extractRefreshToken(req: Request): string {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }
    return refreshToken;
  }

  private async verifyRefreshToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private async generateTokens(user: UserDocument): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private setRefreshTokenCookie(res: Response, token: string): void {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: COOKIE_CONFIG.MAX_AGE_MS,
    });
  }
}
