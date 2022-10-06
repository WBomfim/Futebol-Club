import { Router } from 'express';
import LeaderBoardController from '../controllers/LeaderBoardController';

export default class LeaderBoardRoutes {
  private _routes: Router;
  private _leaderboardController: LeaderBoardController;

  constructor() {
    this._routes = Router();
    this._leaderboardController = new LeaderBoardController();
  }

  public routes(): Router {
    const router = this._routes;

    router.get('/', (req, res) => this._leaderboardController.getLeaderboard(req, res));
    router.get('/home', (req, res) => this._leaderboardController.getLeaderboard(req, res));
    router.get('/away', (req, res) => this._leaderboardController.getLeaderboard(req, res));

    return router;
  }
}
