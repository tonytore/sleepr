import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

/**
 * Common pagination DTO for handling page and limit query parameters.
 */
export class PaginationDto {
  /**
   * The number of items to return per page.
   * @default 10
   */
  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: number = 10;

  /**
   * The current page number.
   * @default 1
   */
  @ApiPropertyOptional({
    description: 'Current page number',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  /**
   * Optional search keyword for finding specific records.
   */
  @ApiPropertyOptional({
    description: 'Search keyword for finding specific records',
    example: 'search term',
  })
  @IsOptional()
  @IsString()
  search?: string;

  /**
   * Gets the number of items to skip for database queries.
   */
  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
