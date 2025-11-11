import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message =
      exception instanceof Error ? exception.message : 'Internal Server Error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        const msg: any = (exceptionResponse as any).message;
        message = Array.isArray(msg) ? msg[0] : (msg ?? exception.message);
      } else {
        message = (exception as any).message ?? message;
      }

      error = exception.name;
    }

    const errorResponse = {
      status: 'error' as const,
      message,
      statusCode: status,
      path: request.url,
      error,
    };

    response.status(status).json(errorResponse);
  }
}
