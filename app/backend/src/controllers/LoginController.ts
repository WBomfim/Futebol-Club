import { Request, Response } from 'express';
import Login from '../interfaces/Login';
import LoginService from '../services/LoginService';

export default class LoginController {
  public _loginService: LoginService;

  constructor() {
    this._loginService = new LoginService();
  }

  public async login(req: Request, res: Response) {
    const { email, password } = req.body as Login;
    const user = await this._loginService.login({ email, password });
    return res.status(200).json(user);
  }
}
