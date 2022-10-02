import User from '../database/models/User';
import Login from '../interfaces/Login';
import Crypto from '../helpers/Crypto';
import Token from '../helpers/Token';
import StatusHttp from '../types/statusHttp';
import ReturnError from '../interfaces/ReturnError';
import { ReturnUser } from '../interfaces/ReturnService';

export default class LoginService {
  private _userModel: typeof User;
  private _crypto: typeof Crypto;
  private _token: typeof Token;

  constructor() {
    this._userModel = User;
    this._crypto = Crypto;
    this._token = Token;
  }

  public async login(infos: Login): Promise<ReturnUser> {
    const { email, password } = infos;

    const user = await this._userModel.findOne({ where: { email } });
    const { password: hash } = user as User;

    const { error } = this._crypto.verifyPassword(password, hash) as ReturnError;
    if (error) return error;

    const token = this._token.generateToken(user as User);

    return { code: StatusHttp.OK, data: { token } };
  }
}
