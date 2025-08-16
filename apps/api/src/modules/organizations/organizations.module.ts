import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import {
  OrganizationMember,
  OrganizationMemberSchema,
} from './schema/organization-member.schema';
import { Organization, OrganizationSchema } from './schema/organization.schema';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
      { name: OrganizationMember.name, schema: OrganizationMemberSchema },
    ]),
    forwardRef(() => UsersModule),
    MailModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(
          'ORGANIZATION_INVITATION_TOKEN_SECRET',
        ),
        signOptions: {
          expiresIn:
            configService.get<string>(
              'ORGANIZATION_INVITATION_TOKEN_EXPIRES_IN',
            ) || '7d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [OrganizationsService],
  controllers: [OrganizationsController],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
