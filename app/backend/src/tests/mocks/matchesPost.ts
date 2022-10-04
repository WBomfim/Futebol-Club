export const returnMatch = {
  "id": 1,
  "homeTeam": 16,
  "homeTeamGoals": 2,
  "awayTeam": 8,
  "awayTeamGoals": 2,
  "inProgress": true,
}

export const boryMatch = {
  valid: {
    "homeTeam": 16,
    "awayTeam": 8,
    "homeTeamGoals": 2,
    "awayTeamGoals": 2,
    "inProgress": true
  },
  teamsEquals: {
    "homeTeam": 8,
    "awayTeam": 8,
    "homeTeamGoals": 2,
    "awayTeamGoals": 2,
    "inProgress": true
  },
  teamNotExisting: {
    "homeTeam": 0,
    "awayTeam": 8,
    "homeTeamGoals": 2,
    "awayTeamGoals": 2,
    "inProgress": true
  }
}
