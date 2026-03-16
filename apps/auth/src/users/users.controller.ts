import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserDto, UpdateStatusDto, UpdateUserDto } from './dto';
import {
  ApiCreateUser,
  ApiDeleteManyUsers,
  ApiDeletePermanentlyUser,
  ApiDeleteUser,
  ApiExportUsers,
  ApiFindAllUser,
  ApiFindOneUser,
  ApiUpdateUser,
  ApiUpdateUserStatus,
} from './swagger/user-swagger.decorator';
import { UsersService } from './users.service';

import type { Response } from 'express';
import { Auth } from '@app/common/auth/decorators/auth.decorator';
import { AuthType } from '@app/common/auth/enums/auth-type.enum';
import { Permissions } from '@app/common/auth/decorators/permissions.decorator';
import { Resource } from '@app/common/auth/enums/resource.enum';
import { Action } from '@app/common/auth/enums/action.enum';
import { PaginationDto } from '@app/common/dto/pagination.dto';
import { IdDto, IdsDto } from '@app/common/dto/id.dto';

/**
 * Controller handles user-related HTTP requests.
 * Provides endpoints for user management, including creation, retrieval, updates, and exports.
 */
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Creates a new user
   */
  @Post()
  @Auth(AuthType.Bearer)
  @Permissions(Resource.User, Action.Create)
  @ApiCreateUser()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Fetches a list of registered users
   */
  @Get()
  @Auth(AuthType.Bearer)
  @Permissions(Resource.User, Action.Read)
  @ApiFindAllUser()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  /**
   * Exports users to CSV (all or selected by IDs)
   */
  @Get('export')
  @Auth(AuthType.Bearer)
  @Permissions(Resource.User, Action.Read)
  @ApiExportUsers()
  async exportUsers(
    @Res() res: Response,
    @Query('ids') ids?: string | string[],
  ) {
    const idsArray = typeof ids === 'string' ? ids.split(',') : ids;
    const csv: string = await this.usersService.exportToCsv(idsArray);
    res.header('Content-Type', 'text/csv');
    res.attachment(`users-export-${Date.now()}.csv`);
    return res.send(csv);
  }

  /**
   * Fetches a single user by ID
   */
  @Get('/one/:id')
  @Auth(AuthType.Bearer)
  @Permissions(Resource.User, Action.Read)
  @ApiFindOneUser()
  findOne(idDto: IdDto) {
    return this.usersService.findOne(idDto.id);
  }

  /**
   * Updates an existing user
   */
  @Patch(':id')
  @Auth(AuthType.Bearer)
  @Permissions(Resource.User, Action.Update)
  @ApiUpdateUser()
  update(idDto: IdDto, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(idDto.id, updateUserDto);
  }

  /**
   * Toggles user account status (active/locked)
   */
  @Patch(':id/status')
  @Auth(AuthType.Bearer)
  @Permissions(Resource.User, Action.Activate)
  @ApiUpdateUserStatus()
  updateStatus(idDto: IdDto, @Body() updateStatusDto: UpdateStatusDto) {
    return this.usersService.updateStatus(idDto.id, updateStatusDto);
  }

  /**
   * Deletes a user by ID
   */
  @Delete(':id')
  @Auth(AuthType.Bearer)
  @Permissions(Resource.User, Action.Delete)
  @ApiDeleteUser()
  remove(@Param() idDto: IdDto) {
    return this.usersService.remove(idDto.id);
  }

  /**
   * Permanently deletes a user by ID
   */
  @Delete('permanently/:id')
  @Auth(AuthType.Bearer)
  @Permissions(Resource.User, Action.Delete)
  @ApiDeletePermanentlyUser()
  removePermanently(@Param() idDto: IdDto) {
    return this.usersService.removePermanently(idDto.id);
  }

  /**
   * Deletes multiple users at once
   */
  @Delete('many')
  @Auth(AuthType.Bearer)
  @Permissions(Resource.User, Action.Delete)
  @ApiDeleteManyUsers()
  removeMany(@Body() idsDto: IdsDto) {
    return this.usersService.removeMany(idsDto);
  }
}
