import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateFavoriteDto {  
  @IsUUID()
  userId: string;

  @IsUUID()
  itemId: string;
  
  @IsString()
  itemType: string;
}
