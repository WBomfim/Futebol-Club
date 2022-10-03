import * as express from 'express';
import LoginRoutes from './routes/LoginRoutes';
import TeamsRoutes from './routes/TeamsRoutes';
import HandleErrors from './middlewares/HandleErrors';
import 'express-async-errors';

class App {
  public app: express.Express;
  private _loginRoutes: LoginRoutes;
  private _teamsRoutes: TeamsRoutes;
  private _handleErrors: typeof HandleErrors;

  constructor() {
    this.app = express();
    this.config();
    this._loginRoutes = new LoginRoutes();
    this._teamsRoutes = new TeamsRoutes();
    this._handleErrors = HandleErrors;

    this.app.get('/', (_req, res) => res.json({ ok: true }));
    this.app.use('/login', this._loginRoutes.routes());
    this.app.use('/teams', this._teamsRoutes.routes());

    this.app.use((
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => this._handleErrors.handleErrors(err, _req, res, _next));
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

export const { app } = new App();
