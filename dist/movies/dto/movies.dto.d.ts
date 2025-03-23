export declare class CreateMovieDto {
    title: string;
    genre: string;
    duration: number;
    rating: number;
    releaseYear: number;
}
declare const UpdateMovieDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateMovieDto>>;
export declare class UpdateMovieDto extends UpdateMovieDto_base {
}
export {};
