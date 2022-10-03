import { Request, Response, NextFunction } from 'express';
import StatusHttp from '../types/statusHttp';

export default class HandleErrors {
  public static handleErrors(_err: Error, _req: Request, res:Response, _next: NextFunction):
  Response {
    return res.status(StatusHttp.INTERNAL_ERROR).json({ message: 'Internal Server Error' });
  }
}
