import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { AIService } from './ai.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  providers: [AIService, SharedModule],
  exports: [AIService],
  controllers: [AIController],
})
export class AIModule {}
