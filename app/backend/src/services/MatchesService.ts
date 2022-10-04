import Match from '../database/models/Match';
import Team from '../database/models/Team';
import validateMatch from '../schemas/ValidateInfosMatch';
import StatusHttp from '../types/statusHttp';
import { ReturnMatch, MatchIncludesTeams } from '../interfaces/ReturnService';
import { MatchCreate, MatchUpdate } from '../interfaces/BodyRequest';
import ReturnError from '../interfaces/ReturnError';

export default class MatchesService {
  private _matches: typeof Match;
  private _validateMatch: typeof validateMatch;
  private _associations: object[];

  constructor() {
    this._matches = Match;
    this._validateMatch = validateMatch;
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

    if (!data || data.length === 0) {
      return { code: StatusHttp.NOT_FOUND, error: { message: 'No matches found' } };
    }

    return { code: StatusHttp.OK, data };
  }

  public async createMatch(match: MatchCreate): Promise<ReturnMatch> {
    const { error } = await this._validateMatch.validateInfosMatch(match) as ReturnError;
    if (error) return error;

    const data = await this._matches.create(match);
    return { code: StatusHttp.CREATED, data };
  }

  public async finishMatch(id: number): Promise<ReturnMatch> {
    await this._matches.update({ inProgress: 0 }, { where: { id } });
    return { code: StatusHttp.OK, data: { message: 'Finished' } };
  }

  public async updateMatch(id: number, goals: MatchUpdate): Promise<ReturnMatch> {
    await this._matches.update(goals, { where: { id } });
    return { code: StatusHttp.OK, data: { message: 'Updated' } };
  }
}
