import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMovieDto, UpdateMovieDto } from "./dto";


@Injectable()
export class MoviesService {
    constructor(private prisma: PrismaService) {}

    async create(createMovieDto: CreateMovieDto) {
        const existing = await this.prisma.movie.findFirst({
            where: {
              title: createMovieDto.title,
              releaseYear: createMovieDto.releaseYear
            }
          });
        
          if (existing) {
            throw new ConflictException('A movie with this title and release year already exists.');
          }
          return this.prisma.movie.create({ data: createMovieDto });
      }

    async findAll() {
        return this.prisma.movie.findMany();
    }
    
    async findOne(id: string) {
        const movie = await this.prisma.movie.findUnique({ where: { id } });
        if (!movie) {
            throw new NotFoundException(`Movie with ID ${id} not found`);
        }
        return movie;
    }

    async update(id: string, updateMovieDto: UpdateMovieDto) {
        await this.findOne(id);
        return this.prisma.movie.update({
            where: { id },
            data: updateMovieDto
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        const ticketCount = await this.prisma.ticket.count({
            where: {
                showtime: {
                    movieId: id
                }
            }
        });
        if (ticketCount > 0) {
            throw new BadRequestException(
                'Cannot delete this movie because it has showtimes with existing tickets.'
            );
        }
        await this.prisma.showtime.deleteMany({
            where: { movieId: id }
        });
      
        return this.prisma.movie.delete({ where: { id } });
    }
}
