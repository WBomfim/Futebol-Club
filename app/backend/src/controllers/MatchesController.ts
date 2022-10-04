import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  private _matchesService: MatchesService;

  constructor() {
    this._matchesService = new MatchesService();
  }

  public async getMatches(req: Request, res: Response): Promise<Response> {
    const { inProgress } = req.query;
    const { code, data, error } = await this._matchesService.getMatches(Boolean(inProgress));
    return res.status(code).json(data || error);
  }
}
