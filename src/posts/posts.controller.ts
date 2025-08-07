import {
  Controller,

  Body,
  UploadedFiles,
  UseInterceptors,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  Request,
  Post
} from '@nestjs/common';

import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

import { AuthGuard } from '@nestjs/passport';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
@UseGuards(AuthGuard('jwt'))
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './uploads/resources',
        filename: (req, file, callback) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          return callback(null, `${uniqueName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
   createPost(
    @Request() req: { user: { id: string } },
    @Body() dto: CreatePostDto,
    @UploadedFiles() files?: Express.Multer.File[],
    
  ) {
    const userId = req.user?.id;
    return this.postsService.createPost(dto, userId, files);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get('/community/:id/resources')
  getPostWithResourcesByCommunityId(@Param('id') id: string) {
    return this.postsService.getPostWithResourcesByCommunityId(id);
  }

  @Get('/community/:id')
  getPostByCommunityId(@Param('id') id: string) {
    return this.postsService.getPostByCommunityId(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
