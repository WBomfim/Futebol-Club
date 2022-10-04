import Team from '../database/models/Team';
import Match from '../database/models/Match';

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

type dataTeam = Team | Team[];
export interface ReturnTeam extends ReturnService {
  data?: dataTeam;
}

export interface MatchIncludesTeams extends Match {
  teamHome: { teamName: string };
  teamAway: { teamName: string };
}

type dataMatch = MatchIncludesTeams | MatchIncludesTeams[];
export interface ReturnMatch extends ReturnService {
  data?: dataMatch;
}
