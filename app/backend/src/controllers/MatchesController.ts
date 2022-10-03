import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  private _matchesService: MatchesService;

  constructor() {
    this._matchesService = new MatchesService();
  }

  public async getMatches(_req: Request, res: Response): Promise<Response> {
    const { code, data, error } = await this._matchesService.getMatches();
    return res.status(code).json(data || error);
  }
}
