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
import { CreateEventParticipantDto } from './dto/create-event-participant.dto';

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
    @Req() req: { user: { id: string } },
  ) {
    return this.eventsService.create(createEventDto, file, req.user.id);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get('/nearby')
  getNearbyEvents(@Req() req: { user: { id: string } }) {
    return this.eventsService.findNearbyEventsSmart(req.user.id);
  }

  @Post('/participants')
  createEventParticipant(@Body() dto: CreateEventParticipantDto) {
    return this.eventsService.createEventParticipant(dto);
  }

  @Get('/participants/:eventId')
  findByEvent(@Param('eventId') eventId: string) {
    return this.eventsService.findParticipantsByEvent(eventId);
  }

  @Delete('/participants/:eventId/:userId')
  removeEventParticipant(@Param('eventId') eventId: string, @Param('userId') userId: string) {
    return this.eventsService.removeEventParticipant(eventId, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }
  

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Get('for-you')
  getEventsForYou(@Req() req: { user: { id: string } }) {
    return this.eventsService.findForYouEvents(req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
