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
exports.MoviesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MoviesService = class MoviesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createMovieDto) {
        const existing = await this.prisma.movie.findFirst({
            where: {
                title: createMovieDto.title,
                releaseYear: createMovieDto.releaseYear
            }
        });
        if (existing) {
            throw new common_1.ConflictException('A movie with this title and release year already exists.');
        }
        return this.prisma.movie.create({ data: createMovieDto });
    }
    async findAll() {
        return this.prisma.movie.findMany();
    }
    async findOne(id) {
        const movie = await this.prisma.movie.findUnique({ where: { id } });
        if (!movie) {
            throw new common_1.NotFoundException(`Movie with ID ${id} not found`);
        }
        return movie;
    }
    async update(id, updateMovieDto) {
        await this.findOne(id);
        return this.prisma.movie.update({
            where: { id },
            data: updateMovieDto
        });
    }
    async remove(id) {
        await this.findOne(id);
        const ticketCount = await this.prisma.ticket.count({
            where: {
                showtime: {
                    movieId: id
                }
            }
        });
        if (ticketCount > 0) {
            throw new common_1.BadRequestException('Cannot delete this movie because it has showtimes with existing tickets.');
        }
        await this.prisma.showtime.deleteMany({
            where: { movieId: id }
        });
        return this.prisma.movie.delete({ where: { id } });
    }
};
exports.MoviesService = MoviesService;
exports.MoviesService = MoviesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MoviesService);
//# sourceMappingURL=movies.service.js.map