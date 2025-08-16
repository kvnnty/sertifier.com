import { ValidationPipe, BadRequestException } from '@nestjs/common';

export const GlobalValidationPipe = new ValidationPipe({
  stopAtFirstError: true,
  exceptionFactory: (errors) => {
    if (!errors.length) {
      return new BadRequestException({
        statusCode: 400,
        error: 'Validation failed',
        message: 'Unknown validation error',
      });
    }

    const firstError = errors[0];
    const constraints = firstError.constraints;

    const message =
      constraints && Object.values(constraints).length > 0
        ? Object.values(constraints)[0]
        : 'Invalid input';

    return new BadRequestException({
      statusCode: 400,
      error: 'Bad Request',
      message,
    });
  },
});
