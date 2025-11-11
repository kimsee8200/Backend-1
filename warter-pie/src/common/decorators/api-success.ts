import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { SuccessResponseDto } from '../dto/success-response.dto';

export function ApiSuccess<TModel extends Type<any>>(model?: TModel) {
  return applyDecorators(
    ApiOkResponse({
      schema: model
        ? {
            allOf: [
              { $ref: getSchemaPath(SuccessResponseDto) },
              {
                properties: {
                  data: { $ref: getSchemaPath(model) },
                },
              },
            ],
          }
        : {
            $ref: getSchemaPath(SuccessResponseDto),
          },
    }),
  );
}

// Swagger schema path helper
import { getSchemaPath } from '@nestjs/swagger';
