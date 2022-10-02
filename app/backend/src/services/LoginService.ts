import User from '../database/models/User';
import Login from '../interfaces/Login';
import Crypto from '../helpers/Crypto';
import Token from '../helpers/Token';
import StatusHttp from '../types/statusHttp';
import ReturnError from '../interfaces/ReturnError';
import { ReturnUser } from '../interfaces/ReturnService';
import ValidateInfosLogin from '../schemas/ValidateInfosLogin';

export default class LoginService {
  private _userModel: typeof User;
  private _crypto: typeof Crypto;
  private _token: typeof Token;
  private _validateInfosLogin: typeof ValidateInfosLogin;

  constructor() {
    this._userModel = User;
    this._crypto = Crypto;
    this._token = Token;
    this._validateInfosLogin = ValidateInfosLogin;
  }

  public async login(infos: Login): Promise<ReturnUser> {
    const { email, password } = infos;

    const { error: errorInfos } = this._validateInfosLogin.validate(infos) as ReturnError;
    if (errorInfos) return errorInfos;

    const user = await this._userModel.findOne({ where: { email } });
    if (!user) {
      return {
        code: StatusHttp.UNAUTHORIZED, error: { message: 'Incorrect email or password' },
      };
    }
    const { password: hash } = user as User;

    const { error } = this._crypto.verifyPassword(password, hash) as ReturnError;
    if (error) return error;

    const token = this._token.generateToken(user as User);

    return { code: StatusHttp.OK, data: { token } };
  }

  public async returnRole(id: number): Promise<ReturnUser> {
    const user = await this._userModel.findByPk(id);
    if (!user) return { code: StatusHttp.NOT_FOUND, error: { message: 'User not found' } };
    const { role } = user as User;
    return { code: StatusHttp.OK, data: { role } };
  }
}
