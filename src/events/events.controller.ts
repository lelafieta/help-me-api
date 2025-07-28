import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  HttpCode,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('events')
@UseGuards(AuthGuard('jwt'))
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @HttpCode(200)
  @Post()
  @UseInterceptors(FileInterceptor('backgroundImageUrl'))
  create(
    @Body() createEventDto: CreateEventDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user: { id: number } },
  ) {
    return this.eventsService.create(createEventDto, file, req.user.id);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(Number(id));
  }

  @Get('/nearby')
  getNearbyEvents(@Req() req: { user: { id: number } }) {
    return this.eventsService.findNearbyEventsSmart(req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(Number(id), updateEventDto);
  }

  @Get('for-you')
  getEventsForYou(@Req() req: { user: { id: number } }) {
    return this.eventsService.findForYouEvents(req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(Number(id));
  }
}
