import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

/**
 * DTO for changing the user's password.
 */
export class ChangePasswordDto {
  /**
   * The user's current password for verification.
   */
  @ApiProperty({ example: 'CurrentPassword123!' })
  @IsString()
  currentPassword: string;

  /**
   * The new strong password to be set.
   */
  @ApiProperty({ example: 'NewStrongPassword123!' })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
