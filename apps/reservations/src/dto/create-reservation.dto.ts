import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({
    description: 'The StartDate the reservation is happen',
    example: '2026-03-13T00:00:00.000Z',
  })
  @IsISO8601()
  startDate: Date;
  @IsISO8601()
  endDAte: Date;

  @IsString()
  @IsNotEmpty()
  placeId: string;

  @IsString()
  @IsNotEmpty()
  invoiceId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
