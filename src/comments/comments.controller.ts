import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
@UseGuards(AuthGuard('jwt'))
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() dto: CreateCommentDto) {
    return this.commentService.create(dto);
  }

  @Get('post/:postId')
  findByPost(@Param('postId') postId: string) {
    return this.commentService.findByPost(postId);
  }

  @Get('blog/:blogId')
  findByBlog(@Param('blogId') blogId: string) {
    return this.commentService.findByBlog(blogId);
  }

  @Get('feed/:feedId')
  findByFeed(@Param('feedId') feedId: string) {
    return this.commentService.findByFeed(feedId);
  }

  @Get('campaign/:campaignId')
  findByCampaign(@Param('campaignId') campaignId: string) {
    return this.commentService.findByCampaign(campaignId);
  }

  @Get('event/:eventId')
  findByEvent(@Param('eventId') eventId: string) {
    return this.commentService.findByEvent(eventId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.commentService.findByUser(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.commentService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.commentService.delete(id);
  }
}
