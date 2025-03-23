import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Tickets - Extended Edge Cases (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let movieId: string;
  let showtimeId: string;
  let pastShowtimeId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  // Setup: Create movie and showtime
  it('Setup: Create movie and showtimes for ticket tests', async () => {
    // Create a movie
    const movieRes = await request(server).post('/movies').send({
      title: 'Ticket Edge Case Movie',
      genre: 'Thriller',
      duration: 120,
      rating: 8.0,
      releaseYear: 2025
    });
    
    movieId = movieRes.body.id;

    // Create a future showtime
    const futureShowtimeRes = await request(server).post('/showtime').send({
      movieId,
      theater: 'Edge Case Theater',
      startTime: '2025-05-01T10:00:00.000Z', // Future date
      endTime: '2025-05-01T12:00:00.000Z',
      price: 15
    });
    
    showtimeId = futureShowtimeRes.body.id;

    // Create a "past" showtime (relative to the test date)
    const pastShowtimeRes = await request(server).post('/showtime').send({
      movieId,
      theater: 'Edge Case Theater',
      startTime: '2025-01-01T10:00:00.000Z', // "Past" date
      endTime: '2025-01-01T12:00:00.000Z',
      price: 15
    });
    
    pastShowtimeId = pastShowtimeRes.body.id;
  });

  // Test invalid seat number format
  it('POST /tickets -> fails with invalid seat number format', async () => {
    const dto = { showtimeId, seatNumber: 999 };
    
    await request(server)
      .post('/tickets')
      .send(dto)
      .expect(400);
  });

  // Test booking multiple seats in one request (if supported)
  it('POST /tickets -> books multiple seats', async () => {
    const dto = { 
      showtimeId, 
      seatNumbers: ['B1', 'B2', 'B3'] 
    };
  
    const res = await request(server)
      .post('/tickets')
      .send(dto)
      .expect(201);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(3);
  });

  // Test booking for a past showtime
  it('POST /tickets -> fails booking for a past showtime', async () => {
    const dto = { showtimeId: pastShowtimeId, seatNumber: 'C10' };
    
    await request(server)
      .post('/tickets')
      .send(dto)
      .expect(400); // Should reject booking for past showtimes
  });

  // Test deletion cascade/constraints
  it('Tests deletion constraints', async () => {
    // Create a showtime specifically for this test
    const showtimeRes = await request(server).post('/showtime').send({
      movieId,
      theater: 'Constraint Test Theater',
      startTime: '2025-06-01T10:00:00.000Z',
      endTime: '2025-06-01T12:00:00.000Z',
      price: 15,
    });
    
    const constraintShowtimeId = showtimeRes.body.id;
  
    // Book a ticket for this showtime
    await request(server)
      .post('/tickets')
      .send({ showtimeId: constraintShowtimeId, seatNumber: 'F10' })
      .expect(201);
    
    // Try to delete the showtime - should fail because it has tickets
    await request(server)
      .delete(`/showtime/${constraintShowtimeId}`)
      .expect(400); // Assuming you block deletion of showtimes with tickets
  });
});
