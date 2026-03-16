import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * Sign in data transfer object - This class is used to validate the sign in data
 */
export class SignInDto {
  /**
   * User email - This property is used to store the user email
   */
  @ApiProperty({
    example: 'someone@gmail.com',
    description: 'User email',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * User password - This property is used to store the user password
   */
  @ApiProperty({
    example: 'StrongPassword@123',
    description: 'User password',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
