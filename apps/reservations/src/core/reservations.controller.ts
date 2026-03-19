import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { UpdateReservationDto } from '../dto/update-reservation.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthType } from '@app/common/auth/enums/auth-type.enum';
import { Auth } from '@app/common/auth/decorators/auth.decorator';
import { CurrentUser } from '@app/common/auth/decorators/current-user.decorator';
import { type JwtPayload } from '@app/common/auth/interfaces/jwt-payload.interface';
import { ApiReservation } from './auth-swagger.decorator';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.CREATED)
  @ApiReservation()
  @ApiReservation()
  create(@Body() dto: CreateReservationDto, @CurrentUser() user: JwtPayload) {
    return this.reservationsService.create(dto, user);
  }

  @Get()
  @Auth(AuthType.Bearer)
  @ApiOperation({ summary: 'Get all reservations' })
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  @Auth(AuthType.Bearer)
  @ApiOperation({ summary: 'Get reservation by ID' })
  @ApiParam({
    name: 'id',
    example: '01J6R3V2A1H8C3J7Z3Y4R2T1WQ',
  })
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  @Auth(AuthType.Bearer)
  @ApiOperation({ summary: 'Update reservation' })
  @ApiParam({
    name: 'id',
    example: '01J6R3V2A1H8C3J7Z3Y4R2T1WQ',
  })
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  @Auth(AuthType.Bearer)
  @ApiOperation({ summary: 'Delete reservation' })
  @ApiParam({
    name: 'id',
    example: '01J6R3V2A1H8C3J7Z3Y4R2T1WQ',
  })
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}
