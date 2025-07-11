import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { OngsController } from './ongs.controller';
import { OngsService } from './ongs.service';

@Module({
      imports: [PrismaModule],
      controllers: [OngsController],
      providers: [OngsService],
})
export class OngsModule {}
