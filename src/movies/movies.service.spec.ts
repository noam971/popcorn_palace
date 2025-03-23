import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreateMovieDto } from './dto/movies.dto';

describe('MoviesService', () => {
  let service: MoviesService;

 
  const mockPrismaService = {
    movie: {
      findMany: jest.fn().mockResolvedValue([]),
      findFirst: jest.fn().mockResolvedValue(null), 
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    ticket: {
      count: jest.fn().mockResolvedValue(0), 
    },
    showtime: {
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    }
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: PrismaService, useValue: mockPrismaService }
      ]
    }).compile();

    service = module.get<MoviesService>(MoviesService);

    // Valid two movies
    (mockPrismaService.movie.findFirst as jest.Mock).mockResolvedValueOnce(null);
    (mockPrismaService.movie.create as jest.Mock)
      .mockImplementationOnce((dto) => Promise.resolve({ id: '1', ...dto }))
      .mockImplementationOnce((dto) => Promise.resolve({ id: '2', ...dto }));
    await service.create({
      title: 'Inception',
      genre: 'Sci-Fi',
      duration: 148,
      rating: 8,
      releaseYear: 2010
    } as unknown as CreateMovieDto);
    await service.create({
      title: 'Interstellar',
      genre: 'Sci-Fi',
      duration: 169,
      rating: 8,
      releaseYear: 2014
    } as unknown as CreateMovieDto);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array (even if empty)', async () => {
      (mockPrismaService.movie.findMany as jest.Mock).mockResolvedValueOnce([]);
      const movies = await service.findAll();
      expect(Array.isArray(movies)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return a movie for a valid id', async () => {
      const movieData = { id: '1', title: 'Inception', genre: 'Sci-Fi', duration: 148, rating: 8, releaseYear: 2010 };
      (mockPrismaService.movie.findUnique as jest.Mock).mockResolvedValueOnce(movieData);
      const movie = await service.findOne('1');
      expect(movie).toEqual(movieData);
    });

    it('should throw an error for a non-existing id', async () => {
      (mockPrismaService.movie.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await expect(service.findOne('999')).rejects.toThrow(/not found/i);
    });
  });

  describe('create', () => {
    it('should create a movie successfully', async () => {
      const dto: CreateMovieDto = {
        title: 'The Matrix',
        genre: 'Sci-Fi',
        duration: 136,
        rating: 8,
        releaseYear: 1999
      };
      (mockPrismaService.movie.findFirst as jest.Mock).mockResolvedValueOnce(null);
      (mockPrismaService.movie.create as jest.Mock).mockResolvedValueOnce({ id: '3', ...dto });
      const movie = await service.create(dto);
      expect(movie).toHaveProperty('id');
      expect(typeof movie.id).toBe('string');
      expect(movie.title).toEqual(dto.title);
    });
  });

  describe('update', () => {
    it('should update a movie successfully', async () => {
      const updateDto = { title: 'Inception Updated', rating: 9 };
      const updatedMovie = { id: '1', title: 'Inception Updated', genre: 'Sci-Fi', duration: 148, rating: 9, releaseYear: 2010 };
      // For update, simulate that findUnique returns an existing movie.
      (mockPrismaService.movie.findUnique as jest.Mock).mockResolvedValueOnce({
        id: '1',
        title: 'Inception',
        genre: 'Sci-Fi',
        duration: 148,
        rating: 8,
        releaseYear: 2010
      });
      (mockPrismaService.movie.update as jest.Mock).mockResolvedValueOnce(updatedMovie);
      const movie = await service.update('1', updateDto);
      expect(movie).toHaveProperty('id', '1');
      expect(movie.title).toEqual('Inception Updated');
      expect(movie.rating).toEqual(9);
    });

    it('should throw an error when updating a non-existent movie', async () => {
      (mockPrismaService.movie.update as jest.Mock).mockRejectedValueOnce(new Error('Movie not found'));
      await expect(service.update('999', { title: 'Does Not Exist', rating: 7 })).rejects.toThrow(/not found/i);
    });
  });

  describe('remove', () => {
    it('should remove a movie successfully', async () => {
      const deletedMovie = { id: '1', title: 'Inception', genre: 'Sci-Fi', duration: 148, rating: 8, releaseYear: 2010 };
      // For remove, simulate that findUnique returns the movie.
      (mockPrismaService.movie.findUnique as jest.Mock).mockResolvedValueOnce(deletedMovie);
      (mockPrismaService.movie.delete as jest.Mock).mockResolvedValueOnce(deletedMovie);
      const movie = await service.remove('1');
      expect(movie).toHaveProperty('id', '1');
    });

    it('should throw an error when trying to remove a non-existent movie', async () => {
      (mockPrismaService.movie.delete as jest.Mock).mockRejectedValueOnce(new Error('Movie not found'));
      await expect(service.remove('999')).rejects.toThrow(/not found/i);
    });
  });
});
