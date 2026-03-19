import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsString } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({
    example: '2026-03-20T10:00:00Z',
    description: 'Reservation start date in ISO 8601 format',
  })
  @IsISO8601()
  startDate: string;

  @ApiProperty({
    example: '2026-03-22T10:00:00Z',
    description: 'Reservation end date in ISO 8601 format',
  })
  @IsISO8601()
  endDate: string;

  // @ApiProperty({
  //   example: '01J6R3V2A1H8C3J7Z3Y4R2T1WQ',
  //   description: 'User ID',
  // })
  // @IsString()
  // userId: string;

  @ApiProperty({
    example: 'place_123',
    description: 'Place ID',
  })
  @IsString()
  placeId: string;

  @ApiProperty({
    example: 'invoice_123',
    description: 'Invoice ID',
  })
  @IsString()
  invoiceId: string;
}
