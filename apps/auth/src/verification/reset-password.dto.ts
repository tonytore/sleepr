import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

/**
 * Reset password data transfer object
 */
export class ResetPasswordDto {
  /**
   * The password reset token received via email
   */
  @ApiProperty({
    description: 'The password reset token received via email',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  /**
   * The new strong password
   */
  @ApiProperty({
    description: 'The new strong password',
    example: 'NewPassword@123',
  })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  newPassword: string;
}
