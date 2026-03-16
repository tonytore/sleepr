import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reservation' })
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reservations' })
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reservation by ID' })
  @ApiParam({
    name: 'id',
    example: '01J6R3V2A1H8C3J7Z3Y4R2T1WQ',
  })
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
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
  @ApiOperation({ summary: 'Delete reservation' })
  @ApiParam({
    name: 'id',
    example: '01J6R3V2A1H8C3J7Z3Y4R2T1WQ',
  })
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}
