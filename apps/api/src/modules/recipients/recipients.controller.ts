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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  BulkImportDto,
  CreateRecipientDto,
  QueryRecipientsDto,
  UpdateRecipientDto,
} from './dto';
import { RecipientsService } from './recipients.service';
import { Request, Response } from 'express';

@Controller('recipients')
@UseGuards(JwtAuthGuard, OrganizationGuard)
export class RecipientsController {
  constructor(private readonly recipientsService: RecipientsService) {}

  @Post()
  create(@Body() createRecipientDto: CreateRecipientDto, @Req() req: Request) {
    return this.recipientsService.create(
      createRecipientDto,
      req.organizationId,
    );
  }

  @Post('bulk-import')
  @UseInterceptors(FileInterceptor('file'))
  bulkImport(
    @UploadedFile() file: Express.Multer.File,
    @Body() bulkImportDto: BulkImportDto,
    @Req() req: Request,
  ) {
    return this.recipientsService.bulkImport(
      file,
      bulkImportDto,
      req.organizationId,
    );
  }

  @Get()
  findAll(@Query() query: QueryRecipientsDto, @Req() req: Request) {
    return this.recipientsService.findAll(req.organizationId, query);
  }

  @Get('export')
  export(
    @Query() query: QueryRecipientsDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.recipientsService.exportToCSV(req.organizationId, query, res);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.recipientsService.findOne(id, req.organizationId);
  }

  @Get(':id/credentials')
  getCredentials(@Param('id') id: string, @Req() req: Request) {
    return this.recipientsService.getCredentials(id, req.organizationId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRecipientDto: UpdateRecipientDto,
    @Req() req: Request,
  ) {
    return this.recipientsService.update(
      id,
      updateRecipientDto,
      req.organizationId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.recipientsService.remove(id, req.organizationId);
  }

  @Delete('bulk')
  bulkDelete(@Body('ids') ids: string[], @Req() req: Request) {
    return this.recipientsService.bulkDelete(ids, req.organizationId);
  }
}
