import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Req,
  UseInterceptors,
  UploadedFile,
  Delete,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { FeedsService } from './feeds.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateLikeDto } from './dto/create-like.dto';
import { CreateViewDto } from './dto/create-view.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';

@Controller('feeds')
@UseGuards(AuthGuard('jwt'))
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) { }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/feeds',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `feed-${unique}${ext}`);
        },
      }),
    }),
  )
  createFeed(
    @Body() dto: CreateFeedDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const imageUrl = file ? `/uploads/feeds/${file.filename}` : null;
    const userId = req.user?.id; // ou do dto se vier manual

    return this.feedsService.createFeed(dto, imageUrl, userId);
  }

  @Get()
  getAllFeeds() {
    return this.feedsService.getAllFeeds();
  }

  @Get(':id')
  async getFeedDetail(
    @Param('id') id: string,
    @Req() reqUser: { user: { id: string } },
    @Req() req: Request,
  ) {
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    return this.feedsService.getFeedById(id, reqUser.user.id, ip, userAgent);
  }

  @Post(':id/comment')
  addComment(@Param('id') feedId: string,
  @Req() req: { user: { id: string } },
  @Body('description') content: string,) {
    const dto: CreateCommentDto = {
      feedId,
      userId: req.user.id,
      description: content,
    };
    return this.feedsService.commentFeed(dto);
  }

  @Post(':id/like-toggle')
  async toggleLikeFeed(
    @Param('id') feedId: string,
    @Req() req: { user: { id: string } },
  ) {
    return this.feedsService.toggleLikeFeed(feedId, req.user.id);
  }


  @Delete(':id')
  async deleteFeed(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
  ) {
    return this.feedsService.deleteFeed(id, req.user.id);
  }

}