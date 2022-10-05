import { MatchIncludesTeams } from '../interfaces/ReturnService';
import TeamBoard from '../interfaces/TeamBoar';

export default class GenerateLeaderboard {
  static initialStatus(teamName: string, teamGoals: number, adversaryGoals: number) {
    const auxEfficiency = teamGoals < adversaryGoals ? 0 : 33.33;
    return {
      name: teamName,
      totalPoints: teamGoals === adversaryGoals ? 1 : 3,
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

  static sortCondition = (a: TeamBoard, b: TeamBoard) => (
    b.totalPoints - a.totalPoints
    || b.totalVictories - a.totalVictories
    || b.goalsBalance - a.goalsBalance
    || b.goalsFavor - a.goalsFavor
    || b.goalsOwn - a.goalsOwn
  );

  static homeTeamsStatus = (games: MatchIncludesTeams[]) => games
    .reduce((acc: TeamBoard[], { teamHome: { teamName }, homeTeamGoals, awayTeamGoals }) => {
      const teamIndex = acc.findIndex(({ name }) => name === teamName);

      if (teamIndex === -1) {
        acc.push(this.initialStatus(teamName, homeTeamGoals, awayTeamGoals));
      } else {
        const team = acc[teamIndex];

        if (homeTeamGoals === awayTeamGoals) team.totalPoints += 1; team.totalDraws += 1;

        if (homeTeamGoals > awayTeamGoals) team.totalPoints += 3; team.totalVictories += 1;

        if (homeTeamGoals < awayTeamGoals) team.totalLosses += 1;

        team.totalGames += 1;
        team.goalsFavor += homeTeamGoals;
        team.goalsOwn += awayTeamGoals;
        team.goalsBalance += homeTeamGoals - awayTeamGoals;
        team.efficiency = Number(((team.totalPoints / (team.totalGames * 3)) * 100).toFixed(2));
      }

      return acc;
    }, []).sort(this.sortCondition);
}

/* const awayTeamsStatus = (games) =>  games.reduce((acc, { teamAway: { teamName }, homeTeamGoals, awayTeamGoals }) => {
  const teamIndex = acc.findIndex(({ name }) => name === teamName);

  if (teamIndex === -1) {
    acc.push(initialStatus(teamName, awayTeamGoals, homeTeamGoals));
  } else {

  const team = acc[teamIndex];

  if (homeTeamGoals === awayTeamGoals) {
    team.totalPoints += 1;
    team.totalDraws += 1;
  }

  if (homeTeamGoals < awayTeamGoals) {
    team.totalPoints += 3;
    team.totalVictories += 1;
  }

  if (homeTeamGoals > awayTeamGoals) {
    team.totalLosses += 1;
  }

  team.totalGames += 1;
  team.goalsFavor += awayTeamGoals;
  team.goalsOwn += homeTeamGoals;
  team.goalsBalance += awayTeamGoals - homeTeamGoals;
  team.efficiency = (team.totalPoints / (team.totalGames * 3) * 100).toFixed(2);
  }

  return acc;
}, []).sort(sortCondition);

const teamsStatus = (games, isHome) => {
  const teams = isHome ? homeTeamsStatus(games) : awayTeamsStatus(games);
  return teams;
} */
