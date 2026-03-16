import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { SessionService } from './session.service';
import {
  ApiGetSessions,
  ApiRevokeOtherSessions,
  ApiRevokeSession,
} from './sessions-swagger.decorator';
import { Auth } from '@app/common/auth/decorators/auth.decorator';
import { AuthType } from '@app/common/auth/enums/auth-type.enum';
import { CurrentUser } from '@app/common/auth/decorators/current-user.decorator';
import type { JwtPayload } from '@app/common/auth/interfaces/jwt-payload.interface';

/**
 * Sessions controller - Session listing and revocation.
 */
@Controller('sessions')
@ApiTags('Sessions')
@ApiBearerAuth()
@Auth(AuthType.Bearer)
export class SessionsController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  @ApiGetSessions()
  getSessions(@CurrentUser() user: JwtPayload) {
    return this.sessionService.getSessions(user.sub);
  }

  @Delete('others')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRevokeOtherSessions()
  revokeOtherSessions(@CurrentUser() user: JwtPayload) {
    return this.sessionService.revokeOtherSessions(user.sub, user.sid);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRevokeSession()
  revokeSession(
    @CurrentUser() user: JwtPayload,
    @Param('id') sessionId: string,
  ) {
    return this.sessionService.revokeSession(user.sub, sessionId);
  }
}
