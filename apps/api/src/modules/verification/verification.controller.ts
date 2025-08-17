import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import { VerificationService } from './verification.service';

@Controller('verify')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get(':credentialId')
  verify(@Param('credentialId') credentialId: string, @Query() query: any) {
    // return this.verificationService.verifyCredential(credentialId, {
    //   ip: query.ip,
    //   userAgent: query.userAgent,
    //   location: query.location
    // });
  }

  @Get(':credentialId/public')
  getPublicCredential(@Param('credentialId') credentialId: string) {
    // return this.verificationService.getPublicCredential(credentialId);
  }

  @Post('batch')
  batchVerify(@Body() credentials: string[]) {
    // return this.verificationService.batchVerify(credentials);
  }
}