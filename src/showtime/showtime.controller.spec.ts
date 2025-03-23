import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimeController } from './showtime.controller';
import { ShowtimeService } from './showtime.service';
import { CreateShowtimeDto } from './dto/showtime.dto';
import { UpdateShowtimeDto } from './dto/showtime.dto';

describe('ShowtimeController', () => {
  let controller: ShowtimeController;
  let service: ShowtimeService;

  const mockShowtimeService = {
    findAll: jest.fn(() => [
      {
        id: "101",
        movieId: "1",
        theater: "Main Hall",
        startTime: "2025-03-23T18:00:00Z",
        endTime: "2025-03-23T20:00:00Z",
        price: 15.0
      }
    ]),
    findOne: jest.fn((id: string) => ({
      id,
      movieId: "1",
      theater: "Main Hall",
      startTime: "2025-03-23T18:00:00Z",
      endTime: "2025-03-23T20:00:00Z",
      price: 15.0
    })),
    create: jest.fn((dto: CreateShowtimeDto) => ({ id: "101", ...dto })),
    update: jest.fn((id: string, dto: UpdateShowtimeDto) => ({ id, ...dto })),
    remove: jest.fn((id: string) => ({ id }))
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimeController],
      providers: [{ provide: ShowtimeService, useValue: mockShowtimeService }]
    }).compile();

    controller = module.get<ShowtimeController>(ShowtimeController);
    service = module.get<ShowtimeService>(ShowtimeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a showtime by id', async () => {
      const result = await controller.findOne("101");
      expect(result).toEqual({
        id: "101",
        movieId: "1",
        theater: "Main Hall",
        startTime: "2025-03-23T18:00:00Z",
        endTime: "2025-03-23T20:00:00Z",
        price: 15.0
      });
      expect(service.findOne).toHaveBeenCalledWith("101");
    });
  });

  describe('create', () => {
    it('should create and return a new showtime', async () => {
      const dto: CreateShowtimeDto = {
        movieId: "1",
        theater: "Main Hall",
        startTime: "2025-03-23T18:00:00Z",
        endTime: "2025-03-23T20:00:00Z",
        price: 15.0
      };
      const result = await controller.create(dto);
      expect(result).toHaveProperty('id');
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update and return the updated showtime', async () => {
      const dto: UpdateShowtimeDto = {
        theater: "Main Hall Updated",
        price: 17.0,
        startTime: "2025-03-23T18:00:00Z",
        endTime: "2025-03-23T20:00:00Z"
      };
      const result = await controller.update("101", dto);
      expect(result).toEqual({ id: "101", ...dto });
      expect(service.update).toHaveBeenCalledWith("101", dto);
    });
  });

  describe('remove', () => {
    it('should remove and return the deleted showtime', async () => {
      const result = await controller.remove("101");
      expect(result).toEqual({ id: "101" });
      expect(service.remove).toHaveBeenCalledWith("101");
    });
  });
});
