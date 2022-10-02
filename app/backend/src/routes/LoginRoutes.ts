import { Router } from 'express';
import LoginController from '../controllers/LoginController';
import Token from '../helpers/Token';

export default class LoginRoutes {
  private _router: Router;
  private _loginController: LoginController;
  private _token: Token;

  constructor() {
    this._router = Router();
    this._loginController = new LoginController();
    this._token = new Token();
  }

  public routes(): Router {
    this._router.post('/', (req, res) => this._loginController.login(req, res));
    this._router.get(
      '/validate',
      (req, res, next) => this._token.verifyToken(req, res, next),
      (req, res) => this._loginController.returnRole(req, res),
    );
    return this._router;
  }
}
