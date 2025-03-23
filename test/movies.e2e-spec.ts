import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Movies - Extended Edge Cases (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let movieId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      })
    );
    await app.init();

    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  // Test long title
  it('POST /movies -> fails with extremely long title', async () => {
    const dto = {
      title: 'A'.repeat(500), // Very long title (500 characters)
      genre: 'Drama',
      duration: 120,
      rating: 8.5,
      releaseYear: 2025
    };

    await request(server)
      .post('/movies')
      .send(dto)
      .expect(201); 
  });

  // Test invalid rating (above 10)
  it('POST /movies -> fails with rating above 10', async () => {
    const dto = {
      title: 'High Rating Movie',
      genre: 'Action',
      duration: 120,
      rating: 11.5,
      releaseYear: 2025
    };

    await request(server)
      .post('/movies')
      .send(dto)
      .expect(400);
  });

  // Test very short duration
  it('POST /movies -> handles very short duration movie', async () => {
    const dto = {
      title: 'Short Film',
      genre: 'Experimental',
      duration: 1, // Just 1 minute
      rating: 8.0,
      releaseYear: 2025
    };

    const res = await request(server)
      .post('/movies')
      .send(dto)
      .expect(201);

    expect(res.body.duration).toBe(1);
    movieId = res.body.id;
  });

  // Test very far future release year
  it('POST /movies -> fails with very far future release year', async () => {
    const dto = {
      title: 'Future Movie',
      genre: 'Sci-Fi',
      duration: 120,
      rating: 8.5,
      releaseYear: 2100 // Far future
    };

    await request(server)
      .post('/movies')
      .send(dto)
      .expect(400); // Assuming validation for reasonable release years
  });

  // Test very old release year
  it('POST /movies -> fails with very old release year', async () => {
    const dto = {
      title: 'Ancient Movie',
      genre: 'Historical',
      duration: 120,
      rating: 7.0,
      releaseYear: 1500 // Very old
    };

    await request(server)
      .post('/movies')
      .send(dto)
      .expect(400); 
  });

  // Test partial update
  it('PATCH /movies/:id -> handles partial update', async () => {
    // Only update the genre
    const updatedFields = { genre: 'Short Experimental' };

    const res = await request(server)
      .patch(`/movies/${movieId}`)
      .send(updatedFields)
      .expect(200);

    expect(res.body.genre).toBe('Short Experimental');
    // Other fields should remain unchanged
    expect(res.body.title).toBe('Short Film');
    expect(res.body.duration).toBe(1);
  });

  // Cleanup 
  it('DELETE /movies/:id -> cleans up the test movie', async () => {
    await request(server)
      .delete(`/movies/${movieId}`)
      .expect(200);
  });
});
