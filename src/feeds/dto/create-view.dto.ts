import { IsString } from 'class-validator';

export class CreateViewDto {
  @IsString()
  feedId: string;

  @IsString()
  userId: string;
}
