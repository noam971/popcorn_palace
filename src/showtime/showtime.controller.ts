import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateShowtimeDto, UpdateShowtimeDto } from './dto';
import { ShowtimeService } from './showtime.service';

@Controller('showtime')
export class ShowtimeController {
    constructor(private readonly showtimesService: ShowtimeService) {}

    @Post()
    create(@Body() createShowtimeDto: CreateShowtimeDto) {
        return this.showtimesService.create(createShowtimeDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.showtimesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateShowtimeDto: UpdateShowtimeDto) {
        return this.showtimesService.update(id, updateShowtimeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.showtimesService.remove(id);
    }
}
