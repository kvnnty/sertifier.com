import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { CredentialsModule } from './modules/credentials/credentials.module';
import { MailModule } from './modules/mail/mail.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { OtpModule } from './modules/otp/otp.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { UsersModule } from './modules/users/users.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync(databaseConfig),
    AuthModule,
    UsersModule,
    OtpModule,
    MailModule,
    OrganizationsModule,
    CredentialsModule,
    TemplatesModule,
    NotificationsModule,
  ],
})
export class AppModule {}
