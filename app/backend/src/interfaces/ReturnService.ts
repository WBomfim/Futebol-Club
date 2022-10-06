import Team from '../database/models/Team';
import Match from '../database/models/Match';
import TeamBoard from './TeamBoar';

export interface ReturnService {
  code: number;
  error?: {
    message: string;
  };
}
export interface ReturnUser extends ReturnService {
  data?: { token: string } | { role: string };
}

export interface ReturnTeam extends ReturnService {
  data?: Team | Team[];
}

export interface MatchIncludesTeams extends Match {
  teamHome: { teamName: string };
  teamAway: { teamName: string };
}

export interface ReturnMatch extends ReturnService {
  data?: Match | Match[] | MatchIncludesTeams | MatchIncludesTeams[] | { message: string };
}

export interface LeaderBoards extends ReturnService {
  data?: TeamBoard[];
}
