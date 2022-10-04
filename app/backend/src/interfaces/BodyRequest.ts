export interface MatchUpdate {
  homeTeamGoals: number;
  awayTeamGoals: number;
}

export interface MatchCreate extends MatchUpdate {
  homeTeam: number;
  awayTeam: number;
  inProgress: boolean;
}
