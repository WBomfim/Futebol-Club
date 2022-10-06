import Match from '../database/models/Match';
import Team from '../database/models/Team';
import GenerateLeaderboard from '../helpers/GenerateLeaderboard';
import { MatchIncludesTeams } from '../interfaces/ReturnService';
import TeamBoard from '../interfaces/TeamBoar';

export default class LeaderboardService {
  private _matches: typeof Match;
  private _generateLeaderboard: typeof GenerateLeaderboard;

  constructor() {
    this._matches = Match;
    this._generateLeaderboard = GenerateLeaderboard;
  }

  private async getMatches(): Promise<MatchIncludesTeams[]> {
    const ASSOCIATIONS = [
      { model: Team, as: 'teamHome', attributes: ['teamName'] },
      { model: Team, as: 'teamAway', attributes: ['teamName'] },
    ];

    return await this._matches.findAll({
      where: { inProgress: 0 },
      include: ASSOCIATIONS,
    }) as MatchIncludesTeams[];
  }

  public async getLeaderboard(): Promise<TeamBoard[]> {
    const matches = await this.getMatches();
    return this._generateLeaderboard.getStatusTeams(matches);
  }

  public async getHomeLeaderboard(): Promise<TeamBoard[]> {
    const matches = await this.getMatches();
    return this._generateLeaderboard.getStatusTeams(matches, 'home');
  }

  public async getAwayLeaderboard(): Promise<TeamBoard[]> {
    const matches = await this.getMatches();
    return this._generateLeaderboard.getStatusTeams(matches, 'away');
  }
}
