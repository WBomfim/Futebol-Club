import { Request, Response } from 'express';
import Login from '../interfaces/Login';
import LoginService from '../services/LoginService';

export default class LoginController {
  private _loginService: LoginService;

  constructor() {
    this._loginService = new LoginService();
  }

  public async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body as Login;
    const { code, data, error } = await this._loginService.login({ email, password });
    if (error) return res.status(code).json(error);
    return res.status(code).json(data);
  }
}
