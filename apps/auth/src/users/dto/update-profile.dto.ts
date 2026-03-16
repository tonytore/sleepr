import { PartialType, PickType } from '@nestjs/swagger';

import { CreateUserDto } from './create-user.dto';

/**
 * DTO for updating the profile of the authenticated user.
 * Picks only the user-editable profile fields from CreateUserDto and makes them all optional.
 */
export class UpdateProfileDto extends PartialType(
  PickType(CreateUserDto, [
    'firstName',
    'middleName',
    'lastName',
    'phoneNumber',
    'dob',
    'gender',
  ] as const),
) {}
