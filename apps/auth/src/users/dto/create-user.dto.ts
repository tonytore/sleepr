import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Create user DTO - Data Transfer Object for creating a new user
 */
export class CreateUserDto {
  /**
   * The first name of the user
   */
  @ApiProperty({
    description: 'The first name of the user',
    example: 'Some',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  /**
   * The middle name of the user
   */
  @ApiProperty({
    description: 'The middle name of the user',
    example: 'One',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  middleName: string;

  /**
   * The last name of the user
   */
  @ApiProperty({
    description: 'The last name of the user',
    example: 'Name',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  /**
   * The email of the user
   */
  @ApiProperty({
    description: 'The email of the user',
    example: 'someone@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * The strong password of the user
   */
  @ApiProperty({
    description: 'The strong password of the user',
    example: 'Password@123',
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
  password: string;

  /**
   * The phone number of the user
   */
  @ApiProperty({
    description: 'The phone number of the user',
    example: '+251912345678',
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(15)
  phoneNumber: string;

  /**
   * The date of birth of the user
   */
  @ApiProperty({
    description: 'The date of birth of the user',
    example: '2000-02-26T17:06:55.690Z',
  })
  @IsDateString()
  @IsNotEmpty()
  dob: string;

  /**
   * The gender of the user
   */
  @ApiProperty({
    description: 'The gender of the user',
    enum: Gender,
    example: Gender.male,
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  /**
   * The roles to assign to the user
   */
  @ApiProperty({
    description: 'The IDs of the roles to assign to the user',
    example: ['01AN4Z07BY79KA1307SR9X4MV3'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roleIds?: string[];
}
