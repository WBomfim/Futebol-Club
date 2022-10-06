import { MatchIncludesTeams } from '../interfaces/ReturnService';
import TeamBoard from '../interfaces/TeamBoar';

export default class GenerateLeaderboard {
  private static initialStatus(teamName: string, teamGoals: number, adversaryGoals: number):
  TeamBoard {
    const auxEfficiency = teamGoals < adversaryGoals ? 0 : 33.33;
    const auxPoints = teamGoals > adversaryGoals ? 3 : 0;

    return {
      name: teamName,
      totalPoints: teamGoals === adversaryGoals ? 1 : auxPoints,
      totalGames: 1,
      totalVictories: teamGoals > adversaryGoals ? 1 : 0,
      totalDraws: teamGoals === adversaryGoals ? 1 : 0,
      totalLosses: teamGoals < adversaryGoals ? 1 : 0,
      goalsFavor: teamGoals,
      goalsOwn: adversaryGoals,
      goalsBalance: teamGoals - adversaryGoals,
      efficiency: teamGoals > adversaryGoals ? 100 : auxEfficiency,
    };
  }

  private static sortCondition = (a: TeamBoard, b: TeamBoard) => (
    b.totalPoints - a.totalPoints
    || b.totalVictories - a.totalVictories
    || b.goalsBalance - a.goalsBalance
    || b.goalsFavor - a.goalsFavor
    || b.goalsOwn - a.goalsOwn
  );

  private static getStutusHomeGames = (games: MatchIncludesTeams[]) => games
    .reduce((acc: TeamBoard[], { teamHome: { teamName }, homeTeamGoals, awayTeamGoals }) => {
      acc.push(this.initialStatus(teamName, homeTeamGoals, awayTeamGoals));
      return acc;
    }, []);

  static getStatusTeamsHome = (games: MatchIncludesTeams[]) => {
    const statusTeamsHome = this.getStutusHomeGames(games);

    return statusTeamsHome.reduce((acc: TeamBoard[], currTeam) => {
      const teamIndex = acc.findIndex(({ name }) => name === currTeam.name);

      if (teamIndex === -1) acc.push(currTeam);
      else {
        const team = acc[teamIndex];

        team.totalPoints += currTeam.totalPoints;
        team.totalVictories += currTeam.totalVictories;
        team.totalDraws += currTeam.totalDraws;
        team.totalLosses += currTeam.totalLosses;
        team.totalGames += 1;
        team.goalsFavor += currTeam.goalsFavor;
        team.goalsOwn += currTeam.goalsOwn;
        team.goalsBalance += currTeam.goalsBalance;
        team.efficiency = ((team.totalPoints / (team.totalGames * 3)) * 100).toFixed(2);
      }
      return acc;
    }, []).sort(this.sortCondition);
  };
}
