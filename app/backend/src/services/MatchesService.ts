import Match from '../database/models/Match';
import Team from '../database/models/Team';
import { ReturnMatch } from '../interfaces/ReturnService';

export default class MatchesService {
  private _matches: typeof Match;

  constructor() {
    this._matches = Match;
  }

  public async getMatches(): Promise<ReturnMatch> {
    const ASSOCIATIONS = [
      { model: Team, as: 'teamHome', attributes: ['teamName'] },
      { model: Team, as: 'teamAway', attributes: ['teamName'] },
    ];
    const data = await this._matches.findAll({ include: ASSOCIATIONS });

    if (!data || data.length === 0) return { code: 404, error: { message: 'No matches found' } };
    return { code: 200, data };
  }
}
