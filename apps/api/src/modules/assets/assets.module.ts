import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Asset, AssetSchema } from './schema/asset.schema';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }]),
    SharedModule
  ],
  controllers: [AssetsController],
  // providers: [AssetsService, FileUploadService],
  providers: [AssetsService],
  exports: [AssetsService],
})
export class AssetsModule {}
