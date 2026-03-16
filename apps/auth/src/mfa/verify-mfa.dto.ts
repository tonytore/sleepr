import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

/**
 * Verify MFA data transfer object
 */
export class VerifyMfaDto {
  /**
   * The 6-digit TOTP code
   */
  @ApiProperty({
    description: 'The 6-digit TOTP code',
    example: '123456',
  })
  @IsString()
  @Length(6, 6)
  code: string;
}
