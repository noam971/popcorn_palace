import { IsString, IsInt, IsNumber, IsNotEmpty, IsPositive, Min, Max } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types';

export class CreateMovieDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    genre: string;

    @IsInt()
    @IsPositive()
    duration: number;

    @IsNumber()
    @Min(0)
    @Max(10)
    rating: number;

    @IsInt()
    @Max(2026)
    @Min(1600)
    releaseYear: number;
}

export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
