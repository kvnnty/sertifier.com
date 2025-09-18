import { Module } from '@nestjs/common';
import { RecipientsService } from './recipients.service';
import { RecipientsController } from './recipients.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Recipient, RecipientSchema } from './schema/recipients.schema';
import {
  Credential,
  CredentialSchema,
} from '../credentials/schema/credential.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Recipient.name, schema: RecipientSchema },
      { name: Credential.name, schema: CredentialSchema },
    ]),
  ],
  controllers: [RecipientsController],
  providers: [RecipientsService],
  exports: [RecipientsService],
})
export class RecipientsModule {}
