import Match from '../database/models/Match';
import Team from '../database/models/Team';
import GenerateLeaderboard from '../helpers/GenerateLeaderboard';
import { MatchIncludesTeams, LeaderBoards } from '../interfaces/ReturnService';
import { GamePlaceOptions } from '../interfaces/TeamBoar';
import StatusHttp from '../types/statusHttp';

export default class LeaderboardService {
  private _matches: typeof Match;
  private _generateLeaderboard: typeof GenerateLeaderboard;

  constructor() {
    this._matches = Match;
    this._generateLeaderboard = GenerateLeaderboard;
  }

  public async getLeaderboard(gamePlace: GamePlaceOptions): Promise<LeaderBoards> {
    const ASSOCIATIONS = [
      { model: Team, as: 'teamHome', attributes: ['teamName'] },
      { model: Team, as: 'teamAway', attributes: ['teamName'] },
    ];

    const matches = await this._matches.findAll({
      where: { inProgress: 0 },
      include: ASSOCIATIONS,
    }) as MatchIncludesTeams[];

    const teamsBoards = this._generateLeaderboard.getStatusTeams(matches, gamePlace);
    return { code: StatusHttp.OK, data: teamsBoards };
  }
}
