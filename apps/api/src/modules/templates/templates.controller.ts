import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto, UpdateTemplateDto, QueryTemplatesDto } from './dto';
import { Request } from 'express';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { OrganizationGuard } from '@/common/guards/organization.guard';

@Controller('templates')
@UseGuards(JwtAuthGuard, OrganizationGuard)
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  create(@Body() createTemplateDto: CreateTemplateDto, @Req() req: Request) {
    return this.templatesService.create(
      createTemplateDto,
      req.user.id,
      req.organizationId,
    );
  }

  @Get()
  findAll(@Query() query: QueryTemplatesDto, @Req() req: Request) {
    return this.templatesService.findAll(req.organizationId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.templatesService.findOne(id, req.organizationId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
    @Req() req: Request,
  ) {
    return this.templatesService.update(
      id,
      updateTemplateDto,
      req.organizationId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.templatesService.remove(id, req.organizationId);
  }

  @Post(':id/duplicate')
  duplicate(@Param('id') id: string, @Req() req: Request) {
    return this.templatesService.duplicate(id, req.organizationId, req.user.id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Req() req: Request,
  ) {
    return this.templatesService.updateStatus(id, status, req.organizationId);
  }
}
