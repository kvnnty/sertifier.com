import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { RecipientsService } from '../recipients/recipients.service';
import { TemplatesService } from '../templates/templates.service';
import { CredentialDocument } from './schema/credential.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PDFService } from '@/utils/services/qr.service';
import { QRService } from '@/utils/services/pdf.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { CreateCredentialsDto } from './dto';

@Injectable()
export class CredentialsService {
  constructor(
    @InjectModel(Credential.name)
    private credentialModel: Model<CredentialDocument>,
    private templatesService: TemplatesService,
    private recipientsService: RecipientsService,
    private notificationsService: NotificationsService,
    private analyticsService: AnalyticsService,
    private pdfService: PDFService,
    private qrService: QRService,
  ) {}

  async create(
    createCredentialDto: CreateCredentialsDto,
    organizationId: string,
  ): Promise<Credential> {
    // Generate unique credential ID and verification code
    const credentialId = this.generateCredentialId();
    const verificationCode = this.generateVerificationCode();

    const credential = new this.credentialModel({
      ...createCredentialDto,
      organizationId,
      credentialId,
      verificationCode,
      qrCodeUrl: await this.qrService.generateQR(credentialId),
      publicUrl: `${process.env.APP_URL}/verify/${credentialId}`,
      issuedAt: new Date(),
    });

    const savedCredential = await credential.save();

    // Send notification email
    await this.notificationsService.sendCredentialEmail(savedCredential);

    // Track analytics
    await this.analyticsService.track(organizationId, 'credential_issued', {
      credentialId: savedCredential._id.toString(),
      campaignId: savedCredential.campaignId.toString(),
    });

    return savedCredential;
  }

  async downloadPDF(
    id: string,
    organizationId: string,
    res: Response,
  ): Promise<void> {
    const credential = await this.findOne(id, organizationId);
    const template = await this.templatesService.findOne(
      credential.templateId.toString(),
      organizationId,
    );

    const pdfBuffer = await this.pdfService.generatePDF(credential, template);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${credential.credentialId}.pdf"`,
    });

    res.send(pdfBuffer);
  }

  async revoke(id: string, reason: string, organizationId: string) {
    const credential = await this.credentialModel
      .findOneAndUpdate(
        { _id: id, organizationId },
        {
          status: 'revoked',
          revokedAt: new Date(),
          revokedReason: reason,
        },
        { new: true },
      )
      .exec();

    if (!credential) {
      throw new NotFoundException('Credential not found');
    }

    // Track revocation
    await this.analyticsService.track(organizationId, 'credential_revoked', {
      credentialId: id,
      reason,
    });

    return credential;
  }

  private generateCredentialId(): string {
    return `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  private generateVerificationCode(): string {
    return Math.random().toString(36).substr(2, 15).toUpperCase();
  }

  // ... other methods ...
}
