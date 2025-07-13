import { Module } from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { FeedsController } from './feeds.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  controllers: [FeedsController],
  providers: [FeedsService],
  imports: [PrismaModule]
})
export class FeedsModule {}
