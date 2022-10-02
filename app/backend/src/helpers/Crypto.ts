import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import StatusHttp from '../types/statusHttp';
import ReturnError from '../interfaces/ReturnError';

export default class Crypto {
  public static hashPassword(password: string): string {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  }

  public static verifyPassword(password: string, hash: string): ReturnError | false {
    const isPasswordValid = compareSync(password, hash);

    if (!isPasswordValid) {
      return {
        error: { code: StatusHttp.UNAUTHORIZED, error: { message: 'Incorrect email or password' } },
      };
    }

    return false;
  }
}
