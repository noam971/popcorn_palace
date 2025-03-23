import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/movies.dto';
import { UpdateMovieDto } from './dto/movies.dto';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const mockMoviesService = {
    findAll: jest.fn(() => [
      { id: "1",
        title: "Inception",
        genre: "Sci-Fi",
        duration: 148,
        rating: 8,
        releaseYear: 2010
      }
    ]),
    findOne: jest.fn((id: string) => ({
      id,
      title: "Inception",
      genre: "Sci-Fi",
      duration: 148,
      rating: 8,
      releaseYear: 2010
    })),
    create: jest.fn((dto: CreateMovieDto) => ({ id: "1", ...dto })),
    update: jest.fn((id: string, dto: UpdateMovieDto) => ({ id, ...dto })),
    remove: jest.fn((id: string) => ({ id }))
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [{ provide: MoviesService, useValue: mockMoviesService }]
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([
        { id: "1", title: "Inception", genre: "Sci-Fi", duration: 148, rating: 8, releaseYear: 2010 }
      ]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a movie by id', async () => {
      const result = await controller.findOne("1");
      expect(result).toEqual({
        id: "1",
        title: "Inception",
        genre: "Sci-Fi",
        duration: 148,
        rating: 8,
        releaseYear: 2010
      });
      expect(service.findOne).toHaveBeenCalledWith("1");
    });
  });

  describe('create', () => {
    it('should create and return a new movie', async () => {
      const dto: CreateMovieDto = {
        title: "The Matrix",
        genre: "Sci-Fi",
        duration: 136,
        rating: 8,
        releaseYear: 1999
      };
      const result = await controller.create(dto);
      expect(result).toHaveProperty('id');
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update and return the updated movie', async () => {
      const dto: UpdateMovieDto = { title: "Inception Updated", rating: 9 };
      const result = await controller.update("1", dto);
      expect(result).toEqual({ id: "1", ...dto });
      expect(service.update).toHaveBeenCalledWith("1", dto);
    });
  });

  describe('remove', () => {
    it('should remove and return the deleted movie', async () => {
      const result = await controller.remove("1");
      expect(result).toEqual({ id: "1" });
      expect(service.remove).toHaveBeenCalledWith("1");
    });
  });
});
