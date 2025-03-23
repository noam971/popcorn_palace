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
exports.ShowtimeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ShowtimeService = class ShowtimeService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateShowtimeData(movie, theater, newStart, newEnd, excludeId) {
        if (newEnd <= newStart) {
            throw new common_1.BadRequestException('startTime must be before endTime');
        }
        const durationInMinutes = (newEnd.getTime() - newStart.getTime()) / (60000);
        if (Math.abs(durationInMinutes - movie.duration) > 5) {
            throw new common_1.BadRequestException(`Showtime duration (${durationInMinutes} min) does not match movie duration (${movie.duration} min)`);
        }
        const whereClause = {
            theater,
            startTime: { lt: newEnd },
            endTime: { gt: newStart }
        };
        if (excludeId) {
            whereClause.id = { not: excludeId };
        }
        const overlapping = await this.prisma.showtime.findFirst({ where: whereClause });
        if (overlapping) {
            throw new common_1.BadRequestException('Showtime overlaps with an existing showtime in the same theater');
        }
    }
    async create(dto) {
        const { movieId, startTime, endTime, theater } = dto;
        const movie = await this.prisma.movie.findUnique({
            where: { id: movieId },
        });
        if (!movie) {
            throw new common_1.NotFoundException(`Movie with ID ${movieId} not found`);
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
    async findOne(id) {
        const showtime = await this.prisma.showtime.findUnique({ where: { id } });
        if (!showtime) {
            throw new common_1.NotFoundException(`Showtime with ID ${id} not found`);
        }
        return showtime;
    }
    async update(id, dto) {
        const existing = await this.findOne(id);
        const newTheater = dto.theater ?? existing.theater;
        const newStart = dto.startTime ? new Date(dto.startTime) : existing.startTime;
        const newEnd = dto.endTime ? new Date(dto.endTime) : existing.endTime;
        const movie = await this.prisma.movie.findUnique({
            where: { id: existing.movieId }
        });
        if (!movie) {
            throw new common_1.NotFoundException(`Movie with ID ${existing.movieId} not found`);
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
    async remove(id) {
        await this.findOne(id);
        const ticketCount = await this.prisma.ticket.count({
            where: { showtimeId: id }
        });
        if (ticketCount > 0) {
            throw new common_1.BadRequestException('Cannot delete showtime with existing tickets');
        }
        return this.prisma.showtime.delete({ where: { id } });
    }
};
exports.ShowtimeService = ShowtimeService;
exports.ShowtimeService = ShowtimeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShowtimeService);
//# sourceMappingURL=showtime.service.js.map