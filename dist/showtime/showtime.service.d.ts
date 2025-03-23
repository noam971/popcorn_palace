import { PrismaService } from '../prisma/prisma.service';
import { CreateShowtimeDto, UpdateShowtimeDto } from './dto';
export declare class ShowtimeService {
    private prisma;
    constructor(prisma: PrismaService);
    private validateShowtimeData;
    create(dto: CreateShowtimeDto): Promise<{
        id: string;
        theater: string;
        startTime: Date;
        endTime: Date;
        price: number;
        movieId: string;
    }>;
    findOne(id: string): Promise<{
        id: string;
        theater: string;
        startTime: Date;
        endTime: Date;
        price: number;
        movieId: string;
    }>;
    update(id: string, dto: UpdateShowtimeDto): Promise<{
        id: string;
        theater: string;
        startTime: Date;
        endTime: Date;
        price: number;
        movieId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        theater: string;
        startTime: Date;
        endTime: Date;
        price: number;
        movieId: string;
    }>;
}
