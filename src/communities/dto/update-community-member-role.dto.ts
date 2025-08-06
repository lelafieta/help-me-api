import { IsUUID, IsString, IsIn } from 'class-validator';

export class UpdateCommunityMemberRoleDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  communityId: string;

  @IsString()
  @IsIn(['admin', 'moderator', 'member'], {
    message: 'Role must be one of: admin, moderator, member',
  })
  role: string;
}
