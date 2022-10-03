import Match from '../database/models/Match';
import { ReturnMatch } from '../interfaces/ReturnService';

export default class MatchesService {
  private _matches: typeof Match;

  constructor() {
    this._matches = Match;
  }

  public async getMatches(): Promise<ReturnMatch> {
    const data = await this._matches.findAll();
    if (!data || data.length === 0) return { code: 404, error: { message: 'No matches found' } };
    return { code: 200, data };
  }
}
