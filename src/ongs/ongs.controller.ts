
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OngsService } from './ongs.service';
import { CreateOngDto } from './dto/create-ong.dto';
import { UpdateOngDto } from './dto/update-ong.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('ongs')
@UseGuards(AuthGuard('jwt'))
export class OngsController {
  constructor(private readonly ongsService: OngsService) {}

  @Post()
  create(@Body() createOngDto: CreateOngDto) {
    return this.ongsService.create(createOngDto);
  }

  @Get()
  findAll() {
    return this.ongsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ongsService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOngDto: UpdateOngDto,
  ) {
    return this.ongsService.update(Number(id), updateOngDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ongsService.remove(Number(id));
  }
}
