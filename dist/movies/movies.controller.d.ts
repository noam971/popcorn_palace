import { MoviesService } from "./movies.service";
import { CreateMovieDto, UpdateMovieDto } from "./dto";
export declare class MoviesController {
    private moviesService;
    constructor(moviesService: MoviesService);
    create(createMovieDto: CreateMovieDto): Promise<{
        title: string;
        genre: string;
        duration: number;
        rating: number;
        releaseYear: number;
        id: string;
    }>;
    findAll(): Promise<{
        title: string;
        genre: string;
        duration: number;
        rating: number;
        releaseYear: number;
        id: string;
    }[]>;
    findOne(id: string): Promise<{
        title: string;
        genre: string;
        duration: number;
        rating: number;
        releaseYear: number;
        id: string;
    }>;
    update(id: string, updateMovieDto: UpdateMovieDto): Promise<{
        title: string;
        genre: string;
        duration: number;
        rating: number;
        releaseYear: number;
        id: string;
    }>;
    remove(id: string): Promise<{
        title: string;
        genre: string;
        duration: number;
        rating: number;
        releaseYear: number;
        id: string;
    }>;
}
