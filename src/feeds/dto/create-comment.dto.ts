import { IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  feedId: string;

  @IsString()
  userId: string;

  @IsString()
  description: string;
}