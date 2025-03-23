import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Showtimes - Extended Edge Cases (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let movieId: string;

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

  // Create a test movie first
  it('Setup: Create a movie for showtime tests', async () => {
    const movieDto = {
      title: 'Edge Case Movie',
      genre: 'Test',
      duration: 115,
      rating: 7.5,
      releaseYear: 2025
    };
    const res = await request(server)
      .post('/movies')
      .send(movieDto)
      .expect(201);

    movieId = res.body.id;
  });

  // Test endTime before startTime
  it('POST /showtime -> fails when endTime is before startTime', async () => {
    const dto = {
      movieId,
      theater: 'Theater A',
      startTime: '2025-03-25T15:00:00.000Z',
      endTime: '2025-03-25T13:00:00.000Z', // End before start
      price: 12.0
    };

    await request(server)
      .post('/showtime')
      .send(dto)
      .expect(400);
  });

  // Test very short showtime
  it('POST /showtime -> fails with very short duration', async () => {
    const dto = {
      movieId,
      theater: 'Theater A',
      startTime: '2025-03-25T15:00:00.000Z',
      endTime: '2025-03-25T15:01:00.000Z', // Just 1 minute
      price: 12.0
    };

    await request(server)
      .post('/showtime')
      .send(dto)
      .expect(400); // Assuming validation for minimum duration
  });

  // Test midnight-crossing showtime
  it('POST /showtime -> handles showtime crossing midnight', async () => {
    const dto = {
      movieId,
      theater: 'Theater B',
      startTime: '2025-03-25T23:00:00.000Z', // 11 PM
      endTime: '2025-03-26T01:00:00.000Z',   // 1 AM next day
      price: 15.0
    };

    const res = await request(server)
      .post('/showtime')
      .send(dto)
      .expect(201); 

    expect(res.body.theater).toBe('Theater B');
    expect(res.body.startTime).toBe('2025-03-25T23:00:00.000Z');
    expect(res.body.endTime).toBe('2025-03-26T01:00:00.000Z');
  });

  // Test with non-existent movieId
  it('POST /showtime -> fails with non-existent movieId', async () => {
    const dto = {
      movieId: 'non-existent-id', // Invalid ID
      theater: 'Theater A',
      startTime: '2025-03-26T13:00:00.000Z',
      endTime: '2025-03-26T15:00:00.000Z',
      price: 10.0
    };

    await request(server)
      .post('/showtime')
      .send(dto)
      .expect(404); // Should reject non-existent movie
  });

  // Test with extremely high price
  it('POST /showtime -> handles extremely high price', async () => {
    const dto = {
      movieId,
      theater: 'VIP Theater',
      startTime: '2025-03-26T13:00:00.000Z',
      endTime: '2025-03-26T15:00:00.000Z',
      price: 1000.0 // Extremely high price
    };

    const res = await request(server)
      .post('/showtime')
      .send(dto)
      .expect(201);

    expect(res.body.price).toBe(1000.0);
  });

  // Test complex overlap scenario
  it('POST /showtime -> handles complex overlap scenario', async () => {
    // First create a showtime from 13:00 to 15:00
    const showtime1 = {
      movieId,
      theater: 'Complex Theater',
      startTime: '2025-03-27T13:00:00.000Z',
      endTime: '2025-03-27T15:00:00.000Z',
      price: 10.0
    };

    await request(server)
      .post('/showtime')
      .send(showtime1)
      .expect(201);

    // Now try to create one that starts before and ends during the first one
    const showtime2 = {
      movieId,
      theater: 'Complex Theater',
      startTime: '2025-03-27T12:00:00.000Z',
      endTime: '2025-03-27T14:00:00.000Z',
      price: 10.0
    };

    await request(server)
      .post('/showtime')
      .send(showtime2)
      .expect(400); // Should reject due to overlap
  });

  // Cleanup - delete the movie
  it('DELETE /movies/:id -> cleans up the test movie', async () => {
    await request(server)
      .delete(`/movies/${movieId}`)
      .expect(200);
  });
});
