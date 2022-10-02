import { Request, Response, NextFunction } from 'express';
import { sign, verify } from 'jsonwebtoken';
import User from '../database/models/User';
import StatusHttp from '../types/statusHttp';

export default class Token {
  private _SECRET_KEY = process.env.JWT_SECRET as string;

  public generateToken(user: User): string {
    const { id, username } = user;
    const payload = {
      id,
      username,
    };

    const config = {
      expiresIn: '1d',
    };

    const token = sign(payload, this._SECRET_KEY, config);
    return token;
  }

  public async verifyToken(req: Request, res: Response, next: NextFunction):
  Promise<Response | void> {
    const token = req.headers.authorization as string;

    if (!token) {
      return res.status(StatusHttp.UNAUTHORIZED).json({ message: 'Token not found' });
    }

    try {
      const payload = verify(token, this._SECRET_KEY);
      req.body.payload = payload;
      next();
    } catch (error) {
      return res.status(StatusHttp.UNAUTHORIZED).json({ message: 'Invalid token' });
    }
  }
}
