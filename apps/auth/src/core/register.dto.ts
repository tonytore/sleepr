import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto';

/**
 * Register DTO - Data Transfer Object for public user registration
 */
export class RegisterDto extends OmitType(CreateUserDto, [
  'roleIds',
] as const) {}
