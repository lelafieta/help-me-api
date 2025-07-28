import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Req,
  HttpCode,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('blogs')
@UseGuards(AuthGuard('jwt'))
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @HttpCode(200)
  @Post()
  @UseInterceptors(FileInterceptor('image')) // <- "image" é o nome do campo no form
  create(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.blogsService.create(createBlogDto, file);
  }

  @HttpCode(200)
  @Get()
  findAll() {
    return this.blogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(Number(id));
  }

  @Get('featured')
  getFeaturedBlogs() {
    return this.blogsService.findFeaturedBlogs();
  }

  @Get('for-you')
  getForYouBlogs(@Req() req: { user: { id: number } }) {
    return this.blogsService.findForYouBlogs(req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(Number(id), updateBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(+id);
  }
}
