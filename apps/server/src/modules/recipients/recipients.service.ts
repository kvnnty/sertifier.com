import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'express';
import * as csv from 'csv-parser';
import * as createCsvWriter from 'csv-writer';
import { Readable } from 'stream';

import {
  CreateRecipientDto,
  UpdateRecipientDto,
  QueryRecipientsDto,
  BulkImportDto,
} from './dto';
import { Credential, CredentialDocument } from '../credentials/schema/credential.schema';
import { Recipient, RecipientDocument } from './schema/recipients.schema';

@Injectable()
export class RecipientsService {
  constructor(
    @InjectModel(Recipient.name)
    private recipientModel: Model<RecipientDocument>,
    @InjectModel(Credential.name)
    private credentialModel: Model<CredentialDocument>,
  ) {}

  async create(
    createRecipientDto: CreateRecipientDto,
    organizationId: string,
  ): Promise<Recipient> {
    // Check if recipient already exists
    const existingRecipient = await this.recipientModel.findOne({
      organizationId,
      email: createRecipientDto.email.toLowerCase(),
    });

    if (existingRecipient) {
      throw new ConflictException('Recipient with this email already exists');
    }

    const recipient = new this.recipientModel({
      ...createRecipientDto,
      email: createRecipientDto.email.toLowerCase(),
      organizationId,
      customFields: new Map(
        Object.entries(createRecipientDto.customFields || {}),
      ),
    });

    return recipient.save();
  }

  async findAll(organizationId: string, query: QueryRecipientsDto) {
    const filter: any = { organizationId, isActive: true };

    // Search functionality
    if (query.search) {
      const searchRegex = { $regex: query.search, $options: 'i' };
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { company: searchRegex },
        { jobTitle: searchRegex },
      ];
    }

    // Tag filtering
    if (query.tags?.length) {
      filter.tags = { $in: query.tags };
    }

    // Company filtering
    if (query.company) {
      filter.company = { $regex: query.company, $options: 'i' };
    }

    // Date range filtering
    if (query.startDate || query.endDate) {
      filter.createdAt = {};
      if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
      if (query.endDate) filter.createdAt.$lte = new Date(query.endDate);
    }

    const limit = Math.min(query.limit || 20, 100);
    const skip = (query.page - 1) * limit || 0;

    const [recipients, total] = await Promise.all([
      this.recipientModel
        .find(filter)
        .sort({
          [query.sortBy || 'createdAt']: query.sortOrder === 'asc' ? 1 : -1,
        })
        .limit(limit)
        .skip(skip)
        .exec(),
      this.recipientModel.countDocuments(filter),
    ]);

    // Get credential counts for each recipient
    const recipientIds = recipients.map((r) => r._id);
    const credentialCounts = await this.credentialModel.aggregate([
      { $match: { recipientId: { $in: recipientIds }, status: 'issued' } },
      { $group: { _id: '$recipientId', count: { $sum: 1 } } },
    ]);

    const countMap = new Map(
      credentialCounts.map((c) => [c._id.toString(), c.count]),
    );

    const recipientsWithCounts = recipients.map((recipient) => ({
      ...recipient.toObject(),
      credentialCount: countMap.get(recipient._id.toString()) || 0,
    }));

    return {
      recipients: recipientsWithCounts,
      pagination: {
        total,
        page: query.page || 1,
        limit,
        pages: Math.ceil(total / limit),
      },
      summary: {
        totalRecipients: total,
        activeRecipients: total,
        totalCredentialsIssued: credentialCounts.reduce(
          (sum, c) => sum + c.count,
          0,
        ),
      },
    };
  }

  async findOne(id: string, organizationId: string): Promise<Recipient> {
    const recipient = await this.recipientModel
      .findOne({ _id: id, organizationId, isActive: true })
      .exec();

    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }

    return recipient;
  }

  async update(
    id: string,
    updateRecipientDto: UpdateRecipientDto,
    organizationId: string,
  ): Promise<Recipient> {
    // Check for email conflicts if email is being updated
    if (updateRecipientDto.email) {
      const existingRecipient = await this.recipientModel.findOne({
        organizationId,
        email: updateRecipientDto.email.toLowerCase(),
        _id: { $ne: id },
      });

      if (existingRecipient) {
        throw new ConflictException(
          'Another recipient with this email already exists',
        );
      }

      updateRecipientDto.email = updateRecipientDto.email.toLowerCase();
    }

    // Convert customFields to Map if provided
    if (updateRecipientDto.customFields) {
      updateRecipientDto.customFields = new Map(
        Object.entries(updateRecipientDto.customFields),
      );
    }

    const recipient = await this.recipientModel
      .findOneAndUpdate(
        { _id: id, organizationId, isActive: true },
        updateRecipientDto,
        { new: true },
      )
      .exec();

    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }

    return recipient;
  }

  async remove(id: string, organizationId: string): Promise<void> {
    // Soft delete - check if recipient has credentials
    const credentialCount = await this.credentialModel.countDocuments({
      recipientId: id,
      status: { $in: ['issued', 'verified'] },
    });

    if (credentialCount > 0) {
      // Soft delete only
      const result = await this.recipientModel.updateOne(
        { _id: id, organizationId },
        { isActive: false },
      );

      if (result.matchedCount === 0) {
        throw new NotFoundException('Recipient not found');
      }
    } else {
      // Hard delete if no credentials
      const result = await this.recipientModel.deleteOne({
        _id: id,
        organizationId,
      });

      if (result.deletedCount === 0) {
        throw new NotFoundException('Recipient not found');
      }
    }
  }

  async bulkDelete(
    ids: string[],
    organizationId: string,
  ): Promise<{ deleted: number; errors: string[] }> {
    const errors: string[] = [];
    let deleted = 0;

    for (const id of ids) {
      try {
        await this.remove(id, organizationId);
        deleted++;
      } catch (error) {
        errors.push(`Failed to delete recipient ${id}: ${error.message}`);
      }
    }

    return { deleted, errors };
  }

  async getCredentials(recipientId: string, organizationId: string) {
    // Verify recipient belongs to organization
    await this.findOne(recipientId, organizationId);

    const credentials = await this.credentialModel
      .find({ recipientId, organizationId })
      .populate('templateId', 'name type')
      .populate('campaignId', 'name')
      .sort({ issuedAt: -1 })
      .exec();

    const summary = {
      total: credentials.length,
      issued: credentials.filter((c) => c.status === 'issued').length,
      revoked: credentials.filter((c) => c.status === 'revoked').length,
      expired: credentials.filter((c) => c.status === 'expired').length,
      totalVerifications: credentials.reduce(
        (sum, c) => sum + c.verificationCount,
        0,
      ),
      totalShares: credentials.reduce((sum, c) => sum + c.socialShares, 0),
    };

    return { credentials, summary };
  }

  async bulkImport(
    file: Express.Multer.File,
    bulkImportDto: BulkImportDto,
    organizationId: string,
  ): Promise<any> {
    if (!file) {
      throw new BadRequestException('CSV file is required');
    }

    const results: any[] = [];
    const errors: string[] = [];
    let processed = 0;

    return new Promise((resolve, reject) => {
      const stream = Readable.from(file.buffer);

      stream
        .pipe(
          csv({
            mapHeaders: ({ header }) =>
              header.trim().toLowerCase().replace(/\s+/g, '_'),
          }),
        )
        .on('data', async (data) => {
          processed++;

          try {
            // Validate required fields
            if (!data.email || !data.first_name || !data.last_name) {
              errors.push(
                `Row ${processed}: Missing required fields (email, first_name, last_name)`,
              );
              return;
            }

            // Map CSV data to recipient format
            const recipientData: CreateRecipientDto = {
              email: data.email.trim().toLowerCase(),
              firstName: data.first_name.trim(),
              lastName: data.last_name.trim(),
              phone: data.phone?.trim() || '',
              company: data.company?.trim() || '',
              jobTitle: data.job_title?.trim() || '',
              tags: data.tags
                ? data.tags.split(',').map((t: string) => t.trim())
                : [],
              customFields: {},
            };

            // Handle custom fields (any field not in the standard set)
            const standardFields = [
              'email',
              'first_name',
              'last_name',
              'phone',
              'company',
              'job_title',
              'tags',
            ];
            Object.keys(data).forEach((key) => {
              if (!standardFields.includes(key) && data[key]) {
                recipientData.customFields[key] = data[key];
              }
            });

            // Check for duplicates based on import settings
            if (bulkImportDto.skipDuplicates) {
              const existing = await this.recipientModel.findOne({
                organizationId,
                email: recipientData.email,
              });

              if (existing) {
                if (bulkImportDto.updateExisting) {
                  // Update existing recipient
                  await this.update(
                    existing._id.toString(),
                    recipientData,
                    organizationId,
                  );
                  results.push({
                    action: 'updated',
                    email: recipientData.email,
                  });
                } else {
                  results.push({
                    action: 'skipped',
                    email: recipientData.email,
                    reason: 'duplicate',
                  });
                }
                return;
              }
            }

            // Create new recipient
            await this.create(recipientData, organizationId);
            results.push({ action: 'created', email: recipientData.email });
          } catch (error) {
            errors.push(`Row ${processed}: ${error.message}`);
          }
        })
        .on('end', () => {
          resolve({
            summary: {
              processed,
              created: results.filter((r) => r.action === 'created').length,
              updated: results.filter((r) => r.action === 'updated').length,
              skipped: results.filter((r) => r.action === 'skipped').length,
              errors: errors.length,
            },
            results,
            errors,
          });
        })
        .on('error', (error) => {
          reject(
            new BadRequestException(`CSV parsing error: ${error.message}`),
          );
        });
    });
  }

  async exportToCSV(
    organizationId: string,
    query: QueryRecipientsDto,
    res: Response,
  ): Promise<void> {
    const { recipients } = await this.findAll(organizationId, {
      ...query,
      limit: 10000,
    });

    // Define CSV headers
    const csvWriter = createCsvWriter.createObjectCsvStringifier({
      header: [
        { id: 'firstName', title: 'First Name' },
        { id: 'lastName', title: 'Last Name' },
        { id: 'email', title: 'Email' },
        { id: 'phone', title: 'Phone' },
        { id: 'company', title: 'Company' },
        { id: 'jobTitle', title: 'Job Title' },
        { id: 'credentialCount', title: 'Credentials Issued' },
        { id: 'tags', title: 'Tags' },
        { id: 'createdAt', title: 'Created At' },
      ],
    });

    // Transform data for CSV
    const csvData = recipients.map((recipient) => ({
      ...recipient,
      tags: Array.isArray(recipient.tags) ? recipient.tags.join(', ') : '',
      createdAt: new Date(recipient.createdAt).toISOString().split('T')[0],
    }));

    const csvString =
      csvWriter.getHeaderString() + csvWriter.stringifyRecords(csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="recipients-${Date.now()}.csv"`,
    );
    res.send(csvString);
  }

  async findByEmail(
    email: string,
    organizationId: string,
  ): Promise<Recipient | null> {
    return this.recipientModel
      .findOne({
        organizationId,
        email: email.toLowerCase(),
        isActive: true,
      })
      .exec();
  }

  async findOrCreate(
    recipientData: CreateRecipientDto,
    organizationId: string,
  ): Promise<Recipient> {
    const existing = await this.findByEmail(
      recipientData.email,
      organizationId,
    );

    if (existing) {
      return existing;
    }

    return this.create(recipientData, organizationId);
  }

  async getRecipientStats(organizationId: string): Promise<any> {
    const stats = await this.recipientModel.aggregate([
      { $match: { organizationId: organizationId, isActive: true } },
      {
        $facet: {
          total: [{ $count: 'count' }],
          byCompany: [
            { $group: { _id: '$company', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
          ],
          byTags: [
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
          ],
          recentlyAdded: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            { $project: { firstName: 1, lastName: 1, email: 1, createdAt: 1 } },
          ],
        },
      },
    ]);

    return {
      total: stats[0].total[0]?.count || 0,
      topCompanies: stats[0].byCompany,
      topTags: stats[0].byTags,
      recentlyAdded: stats[0].recentlyAdded,
    };
  }

  async searchRecipients(
    organizationId: string,
    searchTerm: string,
    limit = 10,
  ): Promise<Recipient[]> {
    const searchRegex = { $regex: searchTerm, $options: 'i' };

    return this.recipientModel
      .find({
        organizationId,
        isActive: true,
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
          { company: searchRegex },
        ],
      })
      .limit(limit)
      .select('firstName lastName email company')
      .exec();
  }

  // AI Integration methods
  async analyzeRecipientEngagement(organizationId: string): Promise<any> {
    // Get recipients with their credential data for AI analysis
    const recipients = await this.recipientModel.aggregate([
      { $match: { organizationId, isActive: true } },
      {
        $lookup: {
          from: 'credentials',
          localField: '_id',
          foreignField: 'recipientId',
          as: 'credentials',
        },
      },
      {
        $addFields: {
          credentialCount: { $size: '$credentials' },
          totalVerifications: { $sum: '$credentials.verificationCount' },
          totalShares: { $sum: '$credentials.socialShares' },
          lastCredentialDate: { $max: '$credentials.issuedAt' },
        },
      },
    ]);

    // AI analysis could be integrated here
    return {
      topPerformers: recipients
        .sort(
          (a, b) =>
            b.totalVerifications +
            b.totalShares -
            (a.totalVerifications + a.totalShares),
        )
        .slice(0, 10),
      engagementTrends: {
        highEngagement: recipients.filter(
          (r) => r.totalVerifications + r.totalShares > 10,
        ).length,
        mediumEngagement: recipients.filter(
          (r) =>
            r.totalVerifications + r.totalShares >= 3 &&
            r.totalVerifications + r.totalShares <= 10,
        ).length,
        lowEngagement: recipients.filter(
          (r) => r.totalVerifications + r.totalShares < 3,
        ).length,
      },
      recommendations: [
        'Consider creating follow-up campaigns for high-engagement recipients',
        'Re-engage low-activity recipients with personalized content',
        'Leverage top performers as case studies or testimonials',
      ],
    };
  }
}
