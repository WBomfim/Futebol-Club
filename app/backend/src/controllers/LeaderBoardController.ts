import { Request, Response } from 'express';
import LeaderBoardService from '../services/LeaderBoardService';
import { GamePlaceOptions } from '../interfaces/TeamBoar';

export default class LeaderBoardController {
  private _leaderboardService: LeaderBoardService;

  constructor() {
    this._leaderboardService = new LeaderBoardService();
  }

  public async getLeaderboard(req: Request, res: Response): Promise<Response> {
    const gamePlace = req.path.replace('/', '') as GamePlaceOptions;
    const { code, data } = await this._leaderboardService.getLeaderboard(gamePlace);
    return res.status(code).json(data);
  }
}
