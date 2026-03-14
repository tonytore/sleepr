import { BaseRepository } from '@app/common/database/repository/base.repository';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ReservationRepository extends BaseRepository<Prisma.ReservationDelegate> {
  constructor(prisma: PrismaService) {
    super(prisma, prisma.reservation);
  }
}
