import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AIService } from '../ai/ai.service';
import { AnalyticsService } from '../analytics/analytics.service';
import {
  CreateTemplateDto,
  QueryTemplatesDto,
  UpdateTemplateDto,
} from './dto';
import {
  Template,
  TemplateDocument,
  TemplateStatus,
} from './schema/template.schema';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name) private templateModel: Model<TemplateDocument>,
    private aiService : AIService,
    private analyticsService: AnalyticsService
  ) {}

  async create(
    createTemplateDto: CreateTemplateDto,
    userId: string,
    organizationId: string,
  ): Promise<Template> {
    const template = new this.templateModel({
      ...createTemplateDto,
      organizationId,
      createdBy: userId,
    });
    return template.save();
  }

  async findAll(organizationId: string, query: QueryTemplatesDto) {
    const filter: any = { organizationId };

    if (query.type) filter.type = query.type;
    if (query.status) filter.status = query.status;
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (query.tags?.length) filter.tags = { $in: query.tags };

    const limit = Math.min(query.limit || 10, 100);
    const skip = (query.page - 1) * limit || 0;

    const [templates, total] = await Promise.all([
      this.templateModel
        .find(filter)
        .sort({
          [query.sortBy || 'createdAt']: query.sortOrder === 'asc' ? 1 : -1,
        })
        .limit(limit)
        .skip(skip)
        .populate('createdBy', 'firstName lastName email')
        .exec(),
      this.templateModel.countDocuments(filter),
    ]);

    return {
      templates,
      pagination: {
        total,
        page: query.page || 1,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, organizationId: string): Promise<Template> {
    const template = await this.templateModel
      .findOne({ _id: id, organizationId })
      .populate('createdBy', 'firstName lastName email')
      .exec();

    if (!template) {
      throw new NotFoundException('Template not found');
    }
    return template;
  }

  async update(
    id: string,
    updateTemplateDto: UpdateTemplateDto,
    organizationId: string,
  ): Promise<Template> {
    const template = await this.templateModel
      .findOneAndUpdate({ _id: id, organizationId }, updateTemplateDto, {
        new: true,
      })
      .exec();

    if (!template) {
      throw new NotFoundException('Template not found');
    }
    return template;
  }

  async remove(id: string, organizationId: string): Promise<void> {
    // Check if template is being used in any active campaigns
    const isUsed = await this.isTemplateInUse(id);
    if (isUsed) {
      throw new ForbiddenException(
        'Cannot delete template that is being used in active campaigns',
      );
    }

    const result = await this.templateModel
      .deleteOne({ _id: id, organizationId })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Template not found');
    }
  }

  async duplicate(
    id: string,
    organizationId: string,
    userId: string,
  ): Promise<Template> {
    const original = await this.findOne(id, organizationId);

    const duplicated = new this.templateModel({
      ...original.toObject(),
      _id: undefined,
      name: `${original.name} (Copy)`,
      status: TemplateStatus.DRAFT,
      createdBy: userId,
      usageCount: 0,
      createdAt: undefined,
      updatedAt: undefined,
    });

    return duplicated.save();
  }

  async updateStatus(
    id: string,
    status: string,
    organizationId: string,
  ): Promise<Template> {
    return this.update(
      id,
      { status: status as TemplateStatus },
      organizationId,
    );
  }

  private async isTemplateInUse(templateId: string): Promise<boolean> {
    // This would check against campaigns - implement when campaigns module is ready
    return false;
  }
  async generateTemplateFromDescription(
    description: string,
    organizationId: string,
    userId: string,
  ): Promise<Template> {
    // AI Integration: Generate template design from natural language description
    const aiDesign = await this.aiService.generateTemplateDesign(description);

    const template = new this.templateModel({
      name: aiDesign.suggestedName,
      description: description,
      type: aiDesign.type,
      design: aiDesign.design,
      fields: aiDesign.suggestedFields,
      organizationId,
      createdBy: userId,
      tags: aiDesign.suggestedTags,
    });

    return template.save();
  }

  async optimizeTemplate(
    id: string,
    organizationId: string,
  ): Promise<Template> {
    // AI Integration: Analyze template usage and suggest optimizations
    const template = await this.findOne(id, organizationId);
    const analytics = await this.analyticsService.getTemplatePerformance(id);

    const optimizations = await this.aiService.suggestTemplateOptimizations(
      template,
      analytics,
    );

    return this.update(id, optimizations, organizationId);
  }

  async translateTemplate(
    id: string,
    targetLanguage: string,
    organizationId: string,
  ): Promise<Template> {
    // AI Integration: Auto-translate template content
    const template = await this.findOne(id, organizationId);
    const translatedContent = await this.aiService.translateTemplate(
      template,
      targetLanguage,
    );

    return this.duplicate(
      id,
      organizationId,
      template.createdBy.toString(),
    ).then((duplicate) =>
      this.update(
        duplicate._id.toString(),
        {
          name: `${template.name} (${targetLanguage})`,
          design: translatedContent.design,
          fields: translatedContent.fields,
        },
        organizationId,
      ),
    );
  }
}

