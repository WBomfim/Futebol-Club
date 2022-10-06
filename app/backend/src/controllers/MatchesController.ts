import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';
import { MatchCreate } from '../interfaces/BodyRequest';

export default class MatchesController {
  private _matchesService: MatchesService;

  constructor() {
    this._matchesService = new MatchesService();
  }

  public async getMatches(req: Request, res: Response): Promise<Response> {
    const { inProgress } = req.query as { inProgress: string };
    const { code, data, error } = await this._matchesService.getMatches(inProgress);
    return res.status(code).json(data || error);
  }

  public async createMatch(req: Request, res: Response): Promise<Response> {
    const {
      homeTeam,
      awayTeam,
      homeTeamGoals,
      awayTeamGoals,
      inProgress,
    } = req.body as MatchCreate;

    const { code, data, error } = await this._matchesService.createMatch(
      { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress },
    );
    return res.status(code).json(data || error);
  }

  public async finishMatch(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { code, data } = await this._matchesService.finishMatch(Number(id));
    return res.status(code).json(data);
  }

  public async updateMatch(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body as MatchCreate;
    const { code, data } = await this._matchesService.updateMatch(
      Number(id),
      {
        homeTeamGoals,
        awayTeamGoals,
      },
    );
    return res.status(code).json(data);
  }
}
