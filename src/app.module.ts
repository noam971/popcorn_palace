import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { MoviesModule } from './movies/movies.module';
import { ShowtimeModule } from './showtime/showtime.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
    }),
    MoviesModule,
    TicketsModule,
    ShowtimeModule,
    PrismaModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
