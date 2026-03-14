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
import { GetReservationDto } from './dto/get-reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param() getReservationDto: GetReservationDto) {
    return this.reservationsService.findOne(getReservationDto);
  }

  @Patch(':id')
  update(
    @Param() getReservationDto: GetReservationDto,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(
      getReservationDto,
      updateReservationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }
}
