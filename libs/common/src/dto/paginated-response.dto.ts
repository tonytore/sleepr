import { ApiProperty } from '@nestjs/swagger';

/**
 * Pagination metadata structure.
 */
export class PaginationMeta {
  @ApiProperty({ description: 'Current page number' })
  currentPage: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ description: 'Total number of items' })
  totalItems: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;
}

/**
 * Generic paginated response wrapper.
 */
export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Success status',
    title: 'true',
  })
  success: boolean;

  @ApiProperty({
    description: 'Status code',
    title: '200',
  })
  statusCode: number;

  @ApiProperty({
    description: 'Message',
    title: 'Operation successful',
  })
  message: string;

  @ApiProperty({
    isArray: true,
    description: 'List of items for the current page',
  })
  data: T[];

  @ApiProperty({ description: 'Pagination metadata' })
  pagination: PaginationMeta;
  //
  /**
   * Constructor
   * @param items - The list of items.
   * @param totalItems - The total number of items.
   * @param paginationDto - The pagination data.
   */
  constructor(
    items: T[],
    totalItems: number,
    paginationDto: { limit: number; page: number },
  ) {
    this.data = items;
    this.pagination = {
      currentPage: paginationDto.page,
      limit: paginationDto.limit,
      totalItems,
      totalPages: Math.ceil(totalItems / (paginationDto.limit || 1)),
    };
  }
}
