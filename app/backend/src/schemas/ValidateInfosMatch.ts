import { Op } from 'sequelize';
import { MatchCreate } from '../interfaces/BodyRequest';
import ReturnError from '../interfaces/ReturnError';
import Team from '../database/models/Team';
import StatusHttp from '../types/statusHttp';

export default class ValidateInfosMatch extends Team {
  public static async validateInfosMatch(match: MatchCreate): Promise<ReturnError | false> {
    const { homeTeam, awayTeam } = match;

    if (homeTeam === awayTeam) {
      return { error: {
        code: StatusHttp.UNAUTHORIZED,
        error: { message: 'It is not possible to create a match with two equal teams' } },
      };
    }

    const isTeams = await this.findAll({
      where: { [Op.or]: [{ id: homeTeam }, { id: awayTeam }] },
    });

    if (isTeams.length !== 2) {
      return { error: {
        code: StatusHttp.NOT_FOUND,
        error: { message: 'There is no team with such id!' } },
      };
    }

    return false;
  }
}
