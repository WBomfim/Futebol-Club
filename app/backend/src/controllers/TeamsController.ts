import { Request, Response } from 'express';
import TeamsService from '../services/TeamsService';

export default class TeamsController {
  private _teamsService: TeamsService;

  constructor() {
    this._teamsService = new TeamsService();
  }

  public async getTeams(req: Request, res: Response): Promise<Response> {
    const { code, data, error } = await this._teamsService.getTeams();
    return res.status(code).json(data || error);
  }

  public async getTeam(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { code, data, error } = await this._teamsService.getTeam(Number(id));
    return res.status(code).json(data || error);
  }
}
