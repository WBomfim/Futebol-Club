import Team from '../database/models/Team';

export interface ReturnService {
  code: number;
  error?: {
    message: string;
  };
}

type dataLogin = { token: string } | { role: string };
export interface ReturnUser extends ReturnService {
  data?: dataLogin;
}

export interface ReturnTeam extends ReturnService {
  data?: Team | Team[];
}
