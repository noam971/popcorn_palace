export declare class CreateShowtimeDto {
    movieId: string;
    theater: string;
    startTime: string;
    endTime: string;
    price: number;
}
declare const UpdateShowtimeDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateShowtimeDto>>;
export declare class UpdateShowtimeDto extends UpdateShowtimeDto_base {
}
export {};
