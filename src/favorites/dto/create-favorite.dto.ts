import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateFavoriteDto {    
  @IsUUID()
  itemId: string;
  
  @IsString()
  itemType: string;
}
