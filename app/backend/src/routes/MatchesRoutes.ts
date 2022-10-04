import { Router } from 'express';
import MatchesController from '../controllers/MatchesController';

export default class MatchesRoutes {
  private _router: Router;
  private _matchesController: MatchesController;

  constructor() {
    this._router = Router();
    this._matchesController = new MatchesController();
  }

  public routes(): Router {
    this._router.get('/', (req, res) => this._matchesController.getMatches(req, res));
    this._router.post('/', (req, res) => this._matchesController.createMatch(req, res));

    return this._router;
  }
}
