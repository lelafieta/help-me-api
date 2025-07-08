import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EventsService]
})
export class EventsModule {}
