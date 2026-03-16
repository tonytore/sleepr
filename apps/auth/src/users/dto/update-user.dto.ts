import { PartialType } from '@nestjs/swagger';

import { CreateUserDto } from './create-user.dto';

/**
 * Update user DTO - Data Transfer Object for updating a user
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
