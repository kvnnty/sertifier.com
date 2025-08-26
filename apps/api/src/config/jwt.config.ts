import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: async (configService: ConfigService) => ({
    secret:
      configService.get<string>('JWT_ACCESS_SECRET') ||
      '5652dd3e53b05864163d9f0cc04c1b209f0e761adf343d0e69dfb7bb',
    signOptions: {
      expiresIn: configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '1h',
    },
  }),
  inject: [ConfigService],
};
