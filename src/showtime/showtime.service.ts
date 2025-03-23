import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShowtimeDto, UpdateShowtimeDto } from './dto';
import { Movie } from '@prisma/client';

@Injectable()
export class ShowtimeService {
    constructor(private prisma: PrismaService) {}

    private async validateShowtimeData(movie: Movie, theater: string, newStart: Date, newEnd: Date, excludeId?: string) {
        if (newEnd <= newStart) {
            throw new BadRequestException('startTime must be before endTime');
        }

        const durationInMinutes = (newEnd.getTime() - newStart.getTime()) / (60000);
        if (Math.abs(durationInMinutes - movie.duration) > 5) { // Allows deviation for up to 5 minutes
            throw new BadRequestException(
                `Showtime duration (${durationInMinutes} min) does not match movie duration (${movie.duration} min)`
            );
        }
    
        const whereClause: any = {
            theater,
            startTime: { lt: newEnd },
            endTime: { gt: newStart }
        };
    
        if (excludeId) {
            whereClause.id = { not: excludeId };
        }
    
        const overlapping = await this.prisma.showtime.findFirst({ where: whereClause });
        if (overlapping) {
            throw new BadRequestException(
                'Showtime overlaps with an existing showtime in the same theater'
            );
        }
    }

    async create(dto: CreateShowtimeDto) {
        const { movieId, startTime, endTime, theater } = dto;

        const movie = await this.prisma.movie.findUnique({
            where: { id: movieId },
        });
        if (!movie) {
            throw new NotFoundException(`Movie with ID ${movieId} not found`);
        }

        const newStart = new Date(startTime);
        const newEnd = new Date(endTime);

        await this.validateShowtimeData(movie, theater, newStart, newEnd);

        return this.prisma.showtime.create({
            data: {
                ...dto,
                startTime: newStart,
                endTime: newEnd
            }
        });
    }

    async findOne(id: string) {
        const showtime = await this.prisma.showtime.findUnique({ where: { id } });
        if (!showtime) {
            throw new NotFoundException(`Showtime with ID ${id} not found`);
        }
        return showtime;
    }

    async update(id: string, dto: UpdateShowtimeDto) {
        const existing = await this.findOne(id);

        const newTheater = dto.theater ?? existing.theater;
        const newStart = dto.startTime ? new Date(dto.startTime) : existing.startTime;
        const newEnd = dto.endTime ? new Date(dto.endTime) : existing.endTime;

        const movie = await this.prisma.movie.findUnique({
            where: { id: existing.movieId }
        });
        if (!movie) {
            throw new NotFoundException(`Movie with ID ${existing.movieId} not found`);
        }

        await this.validateShowtimeData(movie, newTheater, newStart, newEnd, id);

        return this.prisma.showtime.update({
            where: { id },
            data: {
                ...dto,
                theater: newTheater,
                startTime: newStart,
                endTime: newEnd
            }
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        const ticketCount = await this.prisma.ticket.count({
            where: { showtimeId: id }
        });
        if (ticketCount > 0) {
            throw new BadRequestException('Cannot delete showtime with existing tickets');
        }
        return this.prisma.showtime.delete({ where: { id } });
    }
}
