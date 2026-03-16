import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

/**
 * DTO for updating the account status (active/locked) of a user.
 */
export class UpdateStatusDto {
  /**
   * Whether the user account should be active (true) or locked (false).
   */
  @ApiProperty({
    example: true,
    description: 'Whether the user account is active or locked',
  })
  @IsBoolean()
  isActive: boolean;
}
