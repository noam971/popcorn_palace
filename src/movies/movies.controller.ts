import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { MoviesService } from "./movies.service";
import { CreateMovieDto, UpdateMovieDto } from "./dto";


@Controller('movies')
export class MoviesController {
    constructor(private moviesService: MoviesService) {}

    @Post()
    create(@Body() createMovieDto: CreateMovieDto) {
      return this.moviesService.create(createMovieDto);
    }
  
    @Get()
    findAll() {
      return this.moviesService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.moviesService.findOne(id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
      return this.moviesService.update(id, updateMovieDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.moviesService.remove(id);
    }
}
