import { Body, Controller, Post } from '@nestjs/common';
import { CreateTicketDto } from './dto';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) {}

    @Post()
    create(@Body() createTicketDto: CreateTicketDto) {
        return this.ticketsService.create(createTicketDto);
    }
}
