import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './repository/reservation.repository';

@Injectable()
export class ReservationsService {
  constructor(private readonly reservationRepo: ReservationRepository) {}

  async create(createReservationDto: CreateReservationDto) {
    return this.reservationRepo.create({
      data: {
        ...createReservationDto,
        startDate: new Date(createReservationDto.startDate),
        endDate: new Date(createReservationDto.endDate),
      },
    });
  }

  async findAll() {
    return this.reservationRepo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const reservation = await this.reservationRepo.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    await this.findOne(id);

    return this.reservationRepo.update({
      where: { id },
      data: {
        ...updateReservationDto,
        startDate: updateReservationDto.startDate
          ? new Date(updateReservationDto.startDate)
          : undefined,
        endDate: updateReservationDto.endDate
          ? new Date(updateReservationDto.endDate)
          : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.reservationRepo.delete({
      where: { id },
    });
  }
}
