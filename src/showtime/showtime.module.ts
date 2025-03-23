import { Module } from '@nestjs/common';
import { ShowtimeController } from './showtime.controller';
import { ShowtimeService } from './showtime.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ShowtimeController],
  providers: [ShowtimeService, PrismaService]
})

export class ShowtimeModule {}
