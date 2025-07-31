import { Module } from '@nestjs/common';
import { CommunitiesController } from './communities.controller';
import { CommunitiesService } from './communities.service';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
    controllers: [CommunitiesController],
  providers: [CommunitiesService],
  imports: [PrismaModule],
})
export class CommunitiesModule {}
