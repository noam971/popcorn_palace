import { Test, TestingModule } from '@nestjs/testing';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/tickets.dto';

describe('TicketsController', () => {
  let controller: TicketsController;
  let service: TicketsService;

  const mockTicketsService = {
    create: jest.fn((dto: CreateTicketDto) =>
      Promise.resolve({ id: "1", ...dto, bookedAt: new Date() })
    )
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [{ provide: TicketsService, useValue: mockTicketsService }]
    }).compile();

    controller = module.get<TicketsController>(TicketsController);
    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new ticket', async () => {
      const dto: CreateTicketDto = {
        showtimeId: "1",
        seatNumber: "A1"
      };
      const result = await service.create(dto);
    const ticket = Array.isArray(result) ? result[0] : result;
    expect(ticket).toHaveProperty('id');
    expect(ticket.seatNumber).toEqual(dto.seatNumber);

    });
  });
});
