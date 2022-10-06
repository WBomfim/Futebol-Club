import { Request, Response } from 'express';
import LeaderboardService from '../services/leaderBoardService';
import { GamePlaceOptions } from '../interfaces/TeamBoar';

export default class LeaderBoardController {
  private _leaderboardService: LeaderboardService;

  constructor() {
    this._leaderboardService = new LeaderboardService();
  }

  public async getLeaderboard(req: Request, res: Response): Promise<Response> {
    const gamePlace = req.path.replace('/', '') as GamePlaceOptions;
    const { code, data } = await this._leaderboardService.getLeaderboard(gamePlace);
    return res.status(code).json(data);
  }
}
