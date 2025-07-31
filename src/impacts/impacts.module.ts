import { Module } from '@nestjs/common';
import { ImpactsService } from './impacts.service';
import { ImpactsController } from './impacts.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  controllers: [ImpactsController],
  providers: [ImpactsService],
  imports: [PrismaModule],
})
export class ImpactsModule {}
