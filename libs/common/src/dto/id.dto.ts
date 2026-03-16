import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, Length } from 'class-validator';

/**
 * ID DTO - for getting single resource
 */
export class IdDto {
  /**
   * ID of the resource
   */
  @ApiProperty({
    description: 'ID of the resource',
    type: String,
    example: '01KHHVGYJ3W0WE8ENTAYDHCF66',
  })
  @IsString()
  @IsNotEmpty()
  @Length(26, 26)
  id: string;
}

export class IdsDto {
  @ApiProperty({
    description: 'IDs of the resource',
    type: [String],
    example: ['01KHHVGYJ3W0WE8ENTAYDHCF66', '01KHHVGYJ3W0WE8ENTAYDHCF67'],
  })
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  @Length(26, 26, { each: true })
  ids: string[];
}
