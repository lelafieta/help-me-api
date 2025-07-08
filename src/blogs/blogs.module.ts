import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BlogsService]
})
export class BlogsModule {}
