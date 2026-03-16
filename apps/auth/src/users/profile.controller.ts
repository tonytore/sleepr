import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ChangePasswordDto, UpdateProfileDto } from './dto';
import {
  ApiChangePassword,
  ApiGetProfile,
  ApiUpdateProfile,
} from './swagger/profile-swagger.decorator';
import { UsersService } from './users.service';
import { Auth } from '@app/common/auth/decorators/auth.decorator';
import { AuthType } from '@app/common/auth/enums/auth-type.enum';
import { CurrentUser } from '@app/common/auth/decorators/current-user.decorator';
import { type JwtPayload } from '@app/common/auth/interfaces/jwt-payload.interface';
import { VerifiedEmail } from '@app/common/auth/decorators/verified-email.decorator';

/**
 * Controller handles user profile operations.
 * Allows authenticated users to retrieve their profile and change their password.
 */
@Controller('profile')
@ApiTags('Profile')
@ApiBearerAuth()
@Auth(AuthType.Bearer)
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retrieves the profile info of the currently authenticated user.
   * @param user - The JWT payload of the authenticated user.
   * @returns The user profile details from the database.
   */
  @Get('me')
  @ApiGetProfile()
  getProfile(@CurrentUser() user: JwtPayload) {
    return this.usersService.getProfile(user.sub);
  }

  /**
   * Updates the profile info of the currently authenticated user.
   * @param user - The JWT payload of the authenticated user.
   * @param updateProfileDto - The new profile data.
   * @returns The updated user profile information.
   */
  @Patch('me')
  @VerifiedEmail()
  @ApiUpdateProfile()
  updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfileInfo(user.sub, updateProfileDto);
  }

  /**
   * Changes the password of the currently authenticated user.
   * @param user - The JWT payload of the authenticated user.
   * @param changePasswordDto - The current and new password data.
   * @returns A promise that resolves when the password has been successfully updated.
   */
  @Patch('change-password')
  @VerifiedEmail()
  @HttpCode(HttpStatus.OK)
  @ApiChangePassword()
  changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(user.sub, changePasswordDto);
  }
}
