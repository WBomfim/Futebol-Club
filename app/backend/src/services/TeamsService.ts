import { ReturnTeam } from '../interfaces/ReturnService';
import Team from '../database/models/Team';
import StatusHttp from '../types/statusHttp';

export default class TeamsService {
  private _teamsModel: typeof Team;

  constructor() {
    this._teamsModel = Team;
  }

  public async getTeams(): Promise<ReturnTeam> {
    const data = await this._teamsModel.findAll();
    if (!data) return { code: StatusHttp.NOT_FOUND, error: { message: 'Teams not found' } };
    return { code: StatusHttp.OK, data };
  }

  public async getTeam(id: number): Promise<ReturnTeam> {
    const data = await this._teamsModel.findByPk(id);
    if (!data) return { code: StatusHttp.NOT_FOUND, error: { message: 'Team not found' } };
    return { code: StatusHttp.OK, data };
  }
}
