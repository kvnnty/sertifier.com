import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { CertificateTemplateModule } from './modules/certificate-template/certificate-template.module';
import { CertificateModule } from './modules/certificate/certificate.module';
import { CredentialModule } from './modules/credential/credential.module';
import { Organization } from './modules/organization/organization.entity';
import { OrganizationModule } from './modules/organization/organization.module';
import { RecipientModule } from './modules/recipient/recipient.module';
import { UserOrganization } from './modules/user-organization/user-organization.entity';
import { UserOrganizationModule } from './modules/user-organization/user-organization.module';
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
        url: configService.get<string>('DATABASE_URI'),
        entities: [User, Organization, UserOrganization],
        logging: ['error', 'warn'],
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    OrganizationModule,
    UserOrganizationModule,
    RecipientModule,
    CertificateModule,
    CertificateTemplateModule,
    CredentialModule,
    RecipientModule,
  ],
})
export class AppModule {}
