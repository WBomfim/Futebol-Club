import Match from '../database/models/Match';
import Team from '../database/models/Team';
import { ReturnMatch, MatchIncludesTeams } from '../interfaces/ReturnService';

export default class MatchesService {
  private _matches: typeof Match;
  private _associations: object[];

  constructor() {
    this._matches = Match;
    this._associations = [
      { model: Team, as: 'teamHome', attributes: ['teamName'] },
      { model: Team, as: 'teamAway', attributes: ['teamName'] },
    ];
  }

  public async getMatches(inProgress?: string): Promise<ReturnMatch> {
    let data: MatchIncludesTeams[] | null;

    if (inProgress === undefined) {
      data = await this._matches.findAll({ include: this._associations }) as MatchIncludesTeams[];
    } else {
      data = await this._matches.findAll({
        where: { inProgress: inProgress === 'true' },
        include: this._associations,
      }) as MatchIncludesTeams[];
    }

    if (!data || data.length === 0) return { code: 404, error: { message: 'No matches found' } };
    return { code: 200, data };
  }
}
