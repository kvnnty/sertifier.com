import { QRService } from '@/utils/services/pdf.service';
import { PDFService } from '@/utils/services/qr.service';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { RecipientsModule } from '../recipients/recipients.module';
import { TemplatesModule } from '../templates/templates.module';
import { CredentialsController } from './credentials.controller';
import { CredentialsService } from './credentials.service';
import { CredentialSchema } from './schema/credential.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Credential.name, schema: CredentialSchema },
    ]),
    TemplatesModule,
    RecipientsModule,
    NotificationsModule,
    forwardRef(() => CampaignsModule),
  ],
  controllers: [CredentialsController],
  providers: [CredentialsService, PDFService, QRService],
  exports: [CredentialsService],
})
export class CredentialsModule {}