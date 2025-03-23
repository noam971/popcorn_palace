import { CreateShowtimeDto, UpdateShowtimeDto } from './dto';
import { ShowtimeService } from './showtime.service';
export declare class ShowtimeController {
    private readonly showtimesService;
    constructor(showtimesService: ShowtimeService);
    create(createShowtimeDto: CreateShowtimeDto): Promise<{
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
    update(id: string, updateShowtimeDto: UpdateShowtimeDto): Promise<{
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
