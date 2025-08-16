import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssetsService } from './assets.service';
import { UpdateAssetDto, QueryAssetsDto } from './dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { OrganizationGuard } from '@/common/guards/organization.guard';

@Controller('assets')
@UseGuards(JwtAuthGuard, OrganizationGuard)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.assetsService.upload(file, req.user.id, req.organization.id);
  }

  @Get()
  findAll(@Query() query: QueryAssetsDto, @Req() req: Request) {
    return this.assetsService.findAll(req.organization.id, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.assetsService.findOne(id, req.organization.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAssetDto: UpdateAssetDto,
    @Req() req: Request,
  ) {
    return this.assetsService.update(id, updateAssetDto, req.organization.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.assetsService.remove(id, req.organization.id);
  }
}
