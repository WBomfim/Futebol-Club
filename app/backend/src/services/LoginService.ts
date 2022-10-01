import User from '../database/models/User';
import Login from '../interfaces/Login';
import Crypto from '../helpers/Crypto';
import Token from '../helpers/Token';
import StatusHttp from '../types/statusHttp';

export default class LoginService {
  private _userModel: typeof User;
  private _crypto: typeof Crypto;
  private _token: typeof Token;

  constructor() {
    this._userModel = User;
    this._crypto = Crypto;
    this._token = Token;
  }

  public async login(infos: Login) {
    const { email, password } = infos;

    const user = await this._userModel.findOne({ where: { email } });
    const { password: hash } = user as User;

    const isPasswordValid = this._crypto.verifyPassword(password, hash);

    if (!isPasswordValid) {
      return { code: StatusHttp.NOT_FOUND, error: { message: 'Invalid credentials' } };
    }

    const token = this._token.generateToken(user as User);

    return { code: StatusHttp.OK, data: { token } };
  }
}
