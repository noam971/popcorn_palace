import { IsString, IsNumber, IsDateString, IsNotEmpty, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateShowtimeDto {

  @IsString()
  @IsNotEmpty()
  movieId: string; 

  @IsString()
  @IsNotEmpty()
  theater: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsNumber()
  @Min(0)
  price: number;
}

export class UpdateShowtimeDto extends PartialType(CreateShowtimeDto) {}
