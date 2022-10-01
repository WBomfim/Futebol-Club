import { Router } from 'express';
import LoginController from '../controllers/LoginController';

export default class LoginRoutes {
  private _router: Router;
  private _loginController: LoginController;

  constructor() {
    this._router = Router();
    this._loginController = new LoginController();
  }

  public routes() {
    this._router.post('/', (req, res) => this._loginController.login(req, res));
    return this._router;
  }
}
