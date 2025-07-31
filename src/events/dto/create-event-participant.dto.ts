import { IsString, IsUUID } from 'class-validator';

export class CreateEventParticipantDto {
    @IsString()
    @IsUUID()
    eventId: string;

    @IsUUID()
    userId: string;
}
