import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimeService } from './showtime.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShowtimeDto } from './dto/showtime.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ShowtimeService', () => {
  let service: ShowtimeService;

  const mockPrismaService = {
    // Provide a movie property so that validation in create/update/remove works.
    movie: {
      findUnique: jest.fn()
    },
    showtime: {
      findMany: jest.fn().mockResolvedValue([]),
      findFirst: jest.fn().mockResolvedValue(null),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 })
    },
    // Include ticket if needed by remove method, for example:
    ticket: {
      count: jest.fn().mockResolvedValue(0)
    }
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimeService,
        { provide: PrismaService, useValue: mockPrismaService }
      ],
    }).compile();

    service = module.get<ShowtimeService>(ShowtimeService);
  });

  describe('create', () => {
    it('should create a showtime successfully', async () => {
      const dto: CreateShowtimeDto = {
        movieId: "1",
        theater: 'Main Hall',
        startTime: '2025-03-23T18:00:00Z',
        endTime: '2025-03-23T20:00:00Z',
        price: 15.0
      };

      // Simulate that the movie exists
      (mockPrismaService.movie.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
        title: "Inception",
        releaseYear: 2010,
        duration: 125
      });

      // Simulate no overlapping showtime (findFirst) and then create a showtime
      (mockPrismaService.showtime.findFirst as jest.Mock).mockResolvedValueOnce(null);
      (mockPrismaService.showtime.create as jest.Mock).mockResolvedValueOnce({
        id: "101",
        ...dto
      });

      const result = await service.create(dto);
      expect(result).toHaveProperty('id');
      expect(result.theater).toEqual(dto.theater);
    });
  });

  describe('findOne', () => {
    it('should return a showtime for a valid id', async () => {
      // Ensure movie exists (for validation inside findOne if applicable)
      (mockPrismaService.movie.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
        title: "Inception",
        releaseYear: 2010,
        duration: 148
      });
      const showtimeData = {
        id: "101",
        movieId: "1",
        theater: 'Main Hall',
        startTime: '2025-03-23T18:00:00Z',
        endTime: '2025-03-23T20:00:00Z',
        price: 15.0
      };
      (mockPrismaService.showtime.findUnique as jest.Mock).mockResolvedValueOnce(showtimeData);
      const result = await service.findOne("101");
      expect(result).toEqual(showtimeData);
    });

    it('should throw an error for a non-existing id', async () => {
      // Ensure movie exists for the validation step.
      (mockPrismaService.movie.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
        title: "Inception",
        releaseYear: 2010,
        duration: 148
      });
      (mockPrismaService.showtime.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await expect(service.findOne("999")).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a showtime successfully', async () => {
        const updateDto = {
            theater: 'Main Hall Updated',
            price: 17.0,
            startTime: '2025-03-23T18:00:00Z',
            endTime: '2025-03-23T20:00:00Z'
        };
      // For update, ensure the movie exists:
      (mockPrismaService.movie.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
        title: "Inception",
        releaseYear: 2010,
        duration: 115
      });
      const updatedShowtime = {
        id: "101",
        movieId: "1",
        theater: 'Main Hall Updated',
        startTime: '2025-03-23T18:00:00Z',
        endTime: '2025-03-23T20:00:00Z',
        price: 17.0
      };
      (mockPrismaService.showtime.findUnique as jest.Mock).mockResolvedValueOnce(updatedShowtime);
      (mockPrismaService.showtime.update as jest.Mock).mockResolvedValueOnce(updatedShowtime);
      const result = await service.update("101", updateDto);
      expect(result).toHaveProperty('id', "101");
      expect(result.theater).toEqual('Main Hall Updated');
      expect(result.price).toEqual(17.0);
    });

    it('should throw an error when updating a non-existent showtime', async () => {
      (mockPrismaService.movie.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
        title: "Inception",
        releaseYear: 2010,
        duration: 148
      });
      (mockPrismaService.showtime.update as jest.Mock).mockRejectedValueOnce(new Error('Showtime not found'));
      await expect(service.update("999", { theater: 'Does Not Exist', price: 10.0 })).rejects.toThrow(/not found/i);
    });
  });

  describe('remove', () => {
    it('should remove a showtime successfully', async () => {
      const deletedShowtime = {
        id: "101",
        movieId: "1",
        theater: 'Main Hall',
        startTime: '2025-03-23T18:00:00Z',
        endTime: '2025-03-23T20:00:00Z',
        price: 15.0
      };
      // Ensure movie exists.
      (mockPrismaService.movie.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
        title: "Inception",
        releaseYear: 2010,
        duration: 148
      });
      (mockPrismaService.showtime.findUnique as jest.Mock).mockResolvedValueOnce(deletedShowtime);
      (mockPrismaService.showtime.delete as jest.Mock).mockResolvedValueOnce(deletedShowtime);
      (mockPrismaService.showtime.deleteMany as jest.Mock).mockResolvedValueOnce({ count: 0 });
      const result = await service.remove("101");
      expect(result).toHaveProperty('id', "101");
    });

    it('should throw an error when trying to remove a non-existent showtime', async () => {
      (mockPrismaService.movie.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
        title: "Inception",
        releaseYear: 2010,
        duration: 148
      });
      (mockPrismaService.showtime.delete as jest.Mock).mockRejectedValueOnce(new Error('Showtime not found'));
      await expect(service.remove("999")).rejects.toThrow(/not found/i);
    });
  });
});
