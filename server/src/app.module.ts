import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/user/user.entity';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get<string>('MONGODB_URI'),
        entities: [User],
        synchronize: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        logging: ['error', 'warn'],
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
