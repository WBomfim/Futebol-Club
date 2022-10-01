import { Request, Response, NextFunction } from 'express';
import { sign, verify } from 'jsonwebtoken';
import User from '../database/models/User';
import StatusHttp from '../types/statusHttp';

export default class Token {
  private _token: string;
  private _secretKey: string;

  constructor() {
    this._secretKey = process.env.SECRET_KEY as string;
  }

  public generateToken(user: User) {
    const { id, username } = user;
    const payload = {
      id,
      username,
    };

    const config = {
      expiresIn: '1d',
    };

    this._token = sign(payload, this._secretKey, config);
    return this._token;
  }

  public verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization as string;

    if (!token) {
      return res.status(StatusHttp.UNAUTHORIZED).json({ message: 'Token not found' });
    }

    try {
      const payload = verify(token, this._secretKey);
      req.body.payload = payload;
      next();
    } catch (error) {
      return res.status(StatusHttp.UNAUTHORIZED).json({ message: 'Invalid token' });
    }
  }
}
