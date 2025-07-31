// impacts.controller.ts
import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImpactsService } from './impacts.service';
import { CreateImpactDto } from './dto/create-impact.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('impacts')
@UseGuards(AuthGuard('jwt'))
export class ImpactsController {
  constructor(private readonly impactsService: ImpactsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'media', maxCount: 5 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/impacts',
          filename: (req, file, cb) => {
            const name = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            cb(null, `${name}${ext}`);
          },
        }),
      },
    ),
  )
  async createImpact(
    @Body() dto: CreateImpactDto,
    @UploadedFiles()
    files: {
      media?: Express.Multer.File[];
    },
  ) {
    return this.impactsService.createImpactWithMedia(dto, files?.media || []);
  }
}
