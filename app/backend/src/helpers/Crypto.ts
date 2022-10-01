import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export default class Crypto {
  public static hashPassword(password: string): string {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  }

  public static verifyPassword(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }
}
