import { Module } from '@nestjs/common';
import { CommentController } from './comments.controller';
import { CommentService } from './comments.service';
import { Prisma } from '@prisma/client';
import { PrismaModule } from 'src/database/prisma.module';


@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [PrismaModule],  
})
export class CommentsModule {}
