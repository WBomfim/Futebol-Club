import { Router } from 'express';
import Token from '../helpers/Token';
import MatchesController from '../controllers/MatchesController';

export default class MatchesRoutes {
  private _router: Router;
  private _token: Token;
  private _matchesController: MatchesController;

  constructor() {
    this._router = Router();
    this._token = new Token();
    this._matchesController = new MatchesController();
  }

  public routes(): Router {
    this._router.get('/', (req, res) => this._matchesController.getMatches(req, res));

    this._router.post(
      '/',
      (req, res, next) => this._token.verifyToken(req, res, next),
      (req, res) => this._matchesController.createMatch(req, res),
    );

    this._router.patch(
      '/:id/finish',
      (req, res, next) => this._token.verifyToken(req, res, next),
      (req, res) => this._matchesController.finishMatch(req, res),
    );

    this._router.patch(
      '/:id',
      (req, res, next) => this._token.verifyToken(req, res, next),
      (req, res) => this._matchesController.updateMatch(req, res),
    );

    return this._router;
  }
}
