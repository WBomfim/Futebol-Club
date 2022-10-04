import { INTEGER, STRING, Model } from 'sequelize';
import db from '.';

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
  modelName: 'team',
  underscored: true,
  timestamps: false,
});

export default Team;
