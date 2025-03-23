"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TicketsService = class TicketsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTicketDto) {
        const { showtimeId, seatNumber, seatNumbers } = createTicketDto;
        let seatsToBook = [];
        if (seatNumbers && seatNumbers.length > 0) {
            seatsToBook = seatNumbers;
        }
        else if (seatNumber) {
            seatsToBook = [seatNumber];
        }
        else {
            throw new common_1.BadRequestException('Either seatNumber or seatNumbers must be provided');
        }
        const showtime = await this.prisma.showtime.findUnique({
            where: { id: showtimeId }
        });
        if (!showtime) {
            throw new common_1.NotFoundException(`Showtime with ID ${showtimeId} not found`);
        }
        const now = new Date();
        const showtimeStart = new Date(showtime.startTime);
        if (showtimeStart < now) {
            throw new common_1.BadRequestException('Cannot book tickets for past showtimes');
        }
        const existingTickets = await this.prisma.ticket.findMany({
            where: {
                showtimeId,
                seatNumber: { in: seatsToBook }
            }
        });
        if (existingTickets.length > 0) {
            const bookedSeats = existingTickets.map(ticket => ticket.seatNumber).join(', ');
            throw new common_1.BadRequestException(`Seats ${bookedSeats} are already booked for this showtime.`);
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
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map