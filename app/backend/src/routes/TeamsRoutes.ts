import { Router } from 'express';
import TeamsController from '../controllers/TeamsController';

export default class TeamsRoutes {
  private _router: Router;
  private _teamsController: TeamsController;

  constructor() {
    this._router = Router();
    this._teamsController = new TeamsController();
  }

  public routes(): Router {
    this._router.get('/', (req, res) => this._teamsController.getTeams(req, res));
    this._router.get('/:id', (req, res) => this._teamsController.getTeam(req, res));

    return this._router;
  }
}
