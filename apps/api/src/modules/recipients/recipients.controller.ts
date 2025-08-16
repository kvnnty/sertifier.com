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
import { BulkImportDto, CreateRecipientDto, QueryRecipientsDto, UpdateRecipientDto } from './dto',
import { RecipientsService } from './recipients.service';
import { Response } from 'express';

@Controller('recipients')
@UseGuards(JwtAuthGuard, OrganizationGuard)
export class RecipientsController {
  constructor(private readonly recipientsService: RecipientsService) {}

  @Post()
  create(@Body() createRecipientDto: CreateRecipientDto, @Req() req: Request) {
    return this.recipientsService.create(
      createRecipientDto,
      req.organization.id,
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
      req.organization.id,
    );
  }

  @Get()
  findAll(@Query() query: QueryRecipientsDto, @Req() req: Request) {
    return this.recipientsService.findAll(req.organization.id, query);
  }

  @Get('export')
  export(@Query() query: QueryRecipientsDto, @Req() req: Request, @Res() res: Response) {
    return this.recipientsService.exportToCSV(req.organization.id, query, res);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.recipientsService.findOne(id, req.organization.id);
  }

  @Get(':id/credentials')
  getCredentials(@Param('id') id: string, @Req() req: Request) {
    return this.recipientsService.getCredentials(id, req.organization.id);
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
      req.organization.id,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.recipientsService.remove(id, req.organization.id);
  }

  @Delete('bulk')
  bulkDelete(@Body('ids') ids: string[], @Req() req: Request) {
    return this.recipientsService.bulkDelete(ids, req.organization.id);
  }
}
