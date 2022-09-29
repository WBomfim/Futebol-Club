import { INTEGER, STRING, Model } from 'sequelize';
import db from '.';
import Match from './Match';

class Team extends Model {
  id!: number;
  teamName!: string;
}

Team.init({
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  teamName: {
    type: STRING,
    allowNull: false,
  },
}, {
  sequelize: db,
  modelName: 'Team',
  underscored: true,
  timestamps: false,
});

Team.hasMany(Match, { foreignKey: 'homeTeam', as: 'matchesHomeTeam' });
Team.hasMany(Match, { foreignKey: 'awayTeam', as: 'matchesAwayTeam' });

Match.belongsTo(Team, { foreignKey: 'homeTeam' });
Match.belongsTo(Team, { foreignKey: 'awayTeam' });

export default Team;
