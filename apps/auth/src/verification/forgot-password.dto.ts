import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Forgot password data transfer object
 */
export class ForgotPasswordDto {
  /**
   * The email of the user who forgot their password
   */
  @ApiProperty({
    description: 'The email of the user who forgot their password',
    example: 'someone@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
