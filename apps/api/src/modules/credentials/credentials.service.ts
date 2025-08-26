import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import {  } from '../recipients/recipients.service';
import { TemplatesService } from '../templates/templates.service';
import { Credential, CredentialDocument } from './schema/credential.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PDFService } from '@/utils/services/pdf.service';
import { QRService } from '@/utils/services/qr.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { CreateCredentialsDto, QueryCredentialsDto } from './dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CredentialsService {
  constructor(
    @InjectModel(Credential.name)
    private credentialModel: Model<CredentialDocument>,
    private templatesService: TemplatesService,
    private notificationsService: NotificationsService,
    private analyticsService: AnalyticsService,
    private pdfService: PDFService,
    private qrService: QRService,
    private configService: ConfigService,
  ) {}

  async create(
    createCredentialDto: CreateCredentialsDto,
    organizationId: string,
  ) {
    // Generate unique credential ID and verification code
    const credentialId = this.generateCredentialId();
    const verificationCode = this.generateVerificationCode();

    const credential = new this.credentialModel({
      ...createCredentialDto,
      organizationId,
      credentialId,
      verificationCode,
      qrCodeUrl: await this.qrService.generateQR(credentialId),
      publicUrl: `${this.configService.get('SERVER_URL')}/verify/${credentialId}`,
      issuedAt: new Date(),
    });

    const savedCredential = await credential.save();

    // Send notification email
    // await this.notificationsService.sendCredentialEmail(savedCredential);

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

  async findOne(id: string, organizationId: string) {
    const credential = await this.credentialModel
      .findOne({ _id: id, organizationId })
      .populate('templateId', 'name')
      .populate('recipientId', 'email firstName lastName')
      .exec();

    if (!credential) {
      throw new NotFoundException('Credential not found');
    }

    return credential;
  }

  async findAll(organizationId: string, query: QueryCredentialsDto) {
    const { page = 1, limit = 10, status } = query;
    const filter: any = { organizationId };

    if (status) {
      filter.status = status;
    }

    const credentials = await this.credentialModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('templateId', 'name')
      .populate('recipientId', 'email firstName lastName')
      .exec();

    const totalCount = await this.credentialModel.countDocuments(filter).exec();

    return {
      data: credentials,
      totalCount,
      page,
      limit,
    };
  }

  async remove(id: string, organizationId: string) {
    const credential = await this.credentialModel
      .findOneAndDelete({ _id: id, organizationId })
      .exec();

    if (!credential) {
      throw new NotFoundException('Credential not found');
    }

    // Track deletion
    await this.analyticsService.track(organizationId, 'credential_deleted', {
      credentialId: id,
    });

    return { message: 'Credential deleted successfully' };
  }

  private generateCredentialId(): string {
    return `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  private generateVerificationCode(): string {
    return Math.random().toString(36).substr(2, 15).toUpperCase();
  }

  // ... other methods ...
}
