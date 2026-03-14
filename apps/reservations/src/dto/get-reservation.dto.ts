import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ulid } from 'ulid';

export class GetReservationDto {
  @ApiProperty({
    description: 'Optional id of the user',
    example: ulid(),
  })
  @IsString()
  id: string;
}
