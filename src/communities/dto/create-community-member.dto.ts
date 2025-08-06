import { IsUUID, IsString, IsIn } from 'class-validator';

export class CreateCommunityMemberDto {
  @IsString()
  userId: string;

  @IsUUID()
  communityId: string;

  @IsString()
  @IsIn(['ADMIN', 'MODERATOR', 'MEMBER'], {
    message: 'Role must be one of: admin, moderator, member',
  })
  role: string;
}
