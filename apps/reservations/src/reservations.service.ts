import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './repository/reservation.repository';
import { GetReservationDto } from './dto/get-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly reservationRepository: ReservationRepository) {}
  async create(createReservationDto: CreateReservationDto) {
    return await this.reservationRepository.create({
      data: {
        ...createReservationDto,
      },
    });
  }

  async findAll() {
    return await this.reservationRepository.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async findOne(getReservationDto: GetReservationDto) {
    return await this.reservationRepository.findUnique({
      where: {
        id: getReservationDto.id,
      },
    });
  }

  async update(
    getReservationDto: GetReservationDto,
    updateReservationDto: UpdateReservationDto,
  ) {
    return await this.reservationRepository.update({
      where: {
        id: getReservationDto.id,
      },
      data: {
        ...updateReservationDto,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
