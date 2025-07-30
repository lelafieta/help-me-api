// Enviado por quem quer entrar na ONG
export class CreateJoinRequestDto {
  name: string;
  email: string;
  phone: string;
  role: 'MEMBER' | 'VOLUNTEER';
}

// Usado pelo ADMIN para aceitar ou rejeitar
export class RespondJoinRequestDto {
  accept: boolean;
}
