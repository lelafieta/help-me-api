import { IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

class CreateResourceDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  type: string; // ex: "pdf", "image", "video", "link"

  @IsNotEmpty()
  @IsString()
  url: string;
}

export class CreatePostDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  communityId?: string;

  @IsOptional()
  @IsUUID()
  ongId?: string;

  @IsOptional()
  @IsUUID()
  blogId?: string;

  @IsOptional()
  @IsUUID()
  feedId?: string;
}
