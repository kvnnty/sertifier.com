import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message || 'Internal server error',
    };

    // Log error for monitoring
    console.error('HTTP Exception:', {
      ...errorResponse,
      stack: exception.stack,
      user: (request['user'] as any)?.id,
      organization: request['organization']?.id,
    });

    response.status(status).json(errorResponse);
  }
}
