import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { PrismaModule } from 'src/database/prisma.module';
import { BlogsController } from './blogs.controller';

@Module({
  imports: [PrismaModule],
  providers: [BlogsService],
  controllers: [BlogsController],
})
export class BlogsModule {}
