import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateFavoriteDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsUUID()
  itemId: string;

  @IsOptional()
  @IsString()
  itemType?: string;
}
