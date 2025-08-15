import { IsOptional, IsUUID } from 'class-validator';

export class ToggleLikeDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsUUID()
  postId?: string;

  @IsOptional()
  @IsUUID()
  blogId?: string;

  @IsOptional()
  @IsUUID()
  feedId?: string;
}
