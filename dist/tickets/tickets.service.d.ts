import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto';
export declare class TicketsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createTicketDto: CreateTicketDto): Promise<{
        id: string;
        showtimeId: string;
        seatNumber: string;
        bookedAt: Date;
    }[]>;
}
