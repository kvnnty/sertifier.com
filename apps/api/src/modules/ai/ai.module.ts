import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { AIService } from './ai.service';

@Module({
  providers: [
    AIService,
  ],
  exports: [AIService],
  controllers: [AIController],
})
export class AIModule {}
