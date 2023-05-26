const axios = require("axios");
const LEAGUE_ID = 271;
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const DButils = require("./DButils");
const games_utils = require("./games_utils");
const players_utils = require("./players_utils");


/**
 * Function that returns a list of results matching to team name
 */
async function getTeamPreviewByName(teamName) {
    let teamsList = [];
    const teams = await axios.get(`${api_domain}/teams/search/${teamName}`, {
      params: {
        include: "league",
        api_token: process.env.api_token,
      },
    });
    if (teams.data.data){
      teams.data.data.map((team) => {
        const {id, name, logo_path } = team;
        const teamID = id;
        if (team.league && team.league.data){
          const { id } = team.league.data;
          if (id == LEAGUE_ID){
            teamsList.push(
              {
                teamID: teamID, 
                teamName: name,
                logo: logo_path,
              }
            ) 
          };
        }
    });
    }
    return teamsList;
  }

/**
 * Helper function that returns true if team belonges to SUPERLEAGUE and false if it doesn't
 */  
async function checkValidLeague(teamID) {
    let valid = false;
    const league = await axios.get(`${api_domain}/teams/${teamID}/current`, {
      params: {
        api_token: process.env.api_token,
      },
    });
    if (league != undefined && league.data.data && league.data.data.length > 0){
      valid = (league.data.data[0].league_id == LEAGUE_ID);
    }
    return valid;
}

/**
 * Function that returns team full details according to teamID
 */
async function getTeamDetails(teamID){
  let allTeamGames = await getTeamGames(teamID);
  const seperatedGames = await games_utils.getSeperatedPastAndFutureGames(allTeamGames);
  const teamPlayers = await players_utils.getPlayersByTeam(teamID);
  
    return {
      teamID: parseInt(teamID),
      teamName: undefined,
      logo: undefined,
      teamPlayers: teamPlayers,
      futureGames: seperatedGames.futureGames,
      gamesHistory: seperatedGames.gamesHistory
    };
}

/**
 * Helper function that returns all team's games - home and away team
 */ 
async function getTeamGames(teamID){
  const teamGames = await DButils.execQuery(
    `SELECT gameID, gameDateTime FROM dbo.games WHERE homeTeamID = '${teamID}' OR awayTeamID = '${teamID}'` 
  );
  return teamGames;
}

/**
 *  Helper function that gets team ID and returns team name and logo
 */
async function getTeamNameAndLogo(teamID){
  const team = await axios.get(`${api_domain}/teams/${teamID}`, {
    params: {
      api_token: process.env.api_token,
    },
  });
  if (team.data.data){
    return {
      teamID: parseInt(teamID),
      teamName: team.data.data.name,
      logo: team.data.data.logo_path
      }
  }
  else{
    return {
      teamID: undefined,
      teamName: undefined,
      logo: undefined
      }
  }
}

async function getTeamsPreviews(game){
  const homeTeamPreview = await getTeamNameAndLogo(game.homeTeamID)
  const awayTeamPreview = await getTeamNameAndLogo(game.awayTeamID)
  return{
      homeTeamPreview: homeTeamPreview,
      awayTeamPreview, awayTeamPreview
  }
}

exports.getTeamsPreviews = getTeamsPreviews;
exports.getTeamNameAndLogo = getTeamNameAndLogo;
exports.getTeamPreviewByName = getTeamPreviewByName;
exports.checkValidLeague = checkValidLeague;
exports.getTeamDetails = getTeamDetails;

  