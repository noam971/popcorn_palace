import { CreateTicketDto } from './dto';
import { TicketsService } from './tickets.service';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    create(createTicketDto: CreateTicketDto): Promise<{
        id: string;
        showtimeId: string;
        seatNumber: string;
        bookedAt: Date;
    }[]>;
}
