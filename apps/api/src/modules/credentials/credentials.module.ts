import { PDFService } from '@/utils/services/pdf.service';
import { QRService } from '@/utils/services/qr.service';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { RecipientsModule } from '../recipients/recipients.module';
import { TemplatesModule } from '../templates/templates.module';
import { CredentialsController } from './credentials.controller';
import { CredentialsService } from './credentials.service';
import { Credential, CredentialSchema } from './schema/credential.schema';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Credential.name, schema: CredentialSchema },
    ]),
    forwardRef(() => CampaignsModule),
    TemplatesModule,
    RecipientsModule,
    NotificationsModule,
    AnalyticsModule,
  ],
  controllers: [CredentialsController],
  providers: [CredentialsService, PDFService, QRService],
  exports: [CredentialsService],
})
export class CredentialsModule {}
