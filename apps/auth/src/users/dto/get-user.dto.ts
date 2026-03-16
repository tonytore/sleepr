import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ulid } from 'ulid';

/**
 * Get optional id DTO - Data Transfer Object for getting an optional id
 */
export class GetOptionalIdDto {
  /**
   * Optional id of the user
   */
  @ApiPropertyOptional({
    description: 'Optional id of the user',
    example: ulid(),
  })
  @IsOptional()
  @IsString()
  id: string;
}
