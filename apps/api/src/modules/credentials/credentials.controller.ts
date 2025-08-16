import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { OrganizationGuard } from '@/common/guards/organization.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CredentialsService } from './credentials.service';
import { CreateCredentialsDto, QueryCredentialsDto } from './dto';

@Controller('credentials')
@UseGuards(JwtAuthGuard, OrganizationGuard)
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  create(
    @Body() createCredentialDto: CreateCredentialsDto,
    @Req() req: Request,
  ) {
    return this.credentialsService.create(
      createCredentialDto,
      req.organization.id,
    );
  }

  @Get()
  findAll(@Query() query: QueryCredentialsDto, @Req() req: Request) {
    return this.credentialsService.findAll(req.organization.id, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.credentialsService.findOne(id, req.organization.id);
  }

  @Get(':id/download')
  download(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    return this.credentialsService.downloadPDF(id, req.organization.id, res);
  }

  @Post(':id/resend-email')
  resendEmail(@Param('id') id: string, @Req() req: Request) {
    return this.credentialsService.resendEmail(id, req.organization.id);
  }

  @Patch(':id/revoke')
  revoke(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Req() req: Request,
  ) {
    return this.credentialsService.revoke(id, reason, req.organization.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.credentialsService.remove(id, req.organization.id);
  }
}
