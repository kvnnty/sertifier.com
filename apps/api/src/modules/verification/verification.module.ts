import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Verification, VerificationSchema } from './schema/verification.schema';
import { AnalyticsModule } from '../analytics/analytics.module';
import { Credential, CredentialSchema } from '../credentials/schema/credential.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Verification.name, schema: VerificationSchema },
      { name: Credential.name, schema: CredentialSchema },
    ]),
    AnalyticsModule,
  ],
  controllers: [VerificationController],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}