import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  controllers: [LikesController],
  providers: [LikesService],
  imports: [PrismaModule],
})
export class LikesModule {}
