import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto';

@Injectable()
export class TicketsService {
    constructor(private prisma: PrismaService) {}

    async create(createTicketDto: CreateTicketDto) {
        const { showtimeId, seatNumber, seatNumbers } = createTicketDto;
    
        let seatsToBook: string[] = [];
        if (seatNumbers && seatNumbers.length > 0) {
            seatsToBook = seatNumbers;
        } else if (seatNumber) {
            seatsToBook = [seatNumber];
        } else {
            throw new BadRequestException('Either seatNumber or seatNumbers must be provided');
        }
        
        const showtime = await this.prisma.showtime.findUnique({ 
            where: { id: showtimeId } 
        });
        
        if (!showtime) {
            throw new NotFoundException(`Showtime with ID ${showtimeId} not found`);
        }

        const now = new Date();
        const showtimeStart = new Date(showtime.startTime);
        if (showtimeStart < now) {
            throw new BadRequestException('Cannot book tickets for past showtimes');
        }

        const existingTickets = await this.prisma.ticket.findMany({
            where: {
                showtimeId,
                seatNumber: { in: seatsToBook }
            }
        });
        
        if (existingTickets.length > 0) {
            const bookedSeats = existingTickets.map(ticket => ticket.seatNumber).join(', ');
            throw new BadRequestException(
                `Seats ${bookedSeats} are already booked for this showtime.`
            );
        }
    
        const tickets = await this.prisma.ticket.createMany({
            data: seatsToBook.map(seat => ({
                showtimeId,
                seatNumber: seat
            }))
        });
        
        return this.prisma.ticket.findMany({
            where: {
                showtimeId,
                seatNumber: { in: seatsToBook }
            }
        });
    }
}
