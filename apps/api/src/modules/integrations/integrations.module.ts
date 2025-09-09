import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IntegrationsController } from './integrations.controller';
import { Integration, IntegrationSchema } from './schemas/integration.schema';
import { WebhookService } from './webhook.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Integration.name, schema: IntegrationSchema },
    ]),
    SharedModule
  ],
  controllers: [IntegrationsController],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class IntegrationsModule {}
