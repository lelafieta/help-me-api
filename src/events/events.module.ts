import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { PrismaModule } from 'src/database/prisma.module';
import { EventsController } from './events.controller';

@Module({
  imports: [PrismaModule],
  providers: [EventsService],
  controllers: [EventsController]
})
export class EventsModule {}
