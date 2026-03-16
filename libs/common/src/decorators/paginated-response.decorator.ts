import { applyDecorators, type Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { PaginatedResponseDto } from '../dto/paginated-response.dto';

/**
 * Generic Swagger decorator for paginated responses.
 * @param model The model type to be paginated.
 * @param description Optional description for the response.
 */
export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
  description?: string,
  example?: any,
) => {
  return applyDecorators(
    ApiExtraModels(PaginatedResponseDto, model),
    ApiOkResponse({
      description: description || `${model.name} list retrieved successfully`,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
      example: example,
    }),
  );
};
