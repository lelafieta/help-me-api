import { IsString } from 'class-validator';

export class CreateLikeDto {
  @IsString()
  feedId: string;

  @IsString()
  userId: string;
}