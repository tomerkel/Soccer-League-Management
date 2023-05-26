const axios = require("axios");
const games_utils = require("./games_utils");
const users_utils = require("./users_utils");
const LEAGUE_ID = 271;


/**
 * Function that returns SUPERLEAGUE full details - 
 * league Name, season Name, Stage Name, next Game Preview and logged-in user's favorites games, if there is currently logged-in user
 */
async function getLeagueDetails(user_id) {
  let leagueName = "There is no current league Name";
  let currentSeasonName = "There is no current season";
  let currentStageName = "There is no current stage";
  const league = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );

  if (league.data.data){
    if (league.data.data.name){
      leagueName = league.data.data.name;
    }
    if (league.data.data.current_stage_id){
      const stage = await axios.get(
        `https://soccer.sportmonks.com/api/v2.0/stages/${league.data.data.current_stage_id}`,
        {
          params: {
            api_token: process.env.api_token,
          },
        }
      );
      if (stage.data.data && stage.data.data.name){
        currentStageName = stage.data.data.name;
      }
    }
    if (league.data.data.season && league.data.data.season.data.name){
      currentSeasonName = league.data.data.season.data.name;
    }
  }
  
  // for all users
  let sortedGames = await games_utils.getSortedGamesByDate();
  const nextGame = await games_utils.getFutureGames(sortedGames);
  const nextGamePreview = await games_utils.getGameByID(nextGame[0].gameID, true);

  // for logged in users
  let futureFavorites = [];
  if (user_id) {
    futureFavorites = await users_utils.getUserFutureFavorites(user_id);
    if (futureFavorites.length > 3){
      futureFavorites = futureFavorites.slice(0,3);
    }
  }

  return {
    leagueName: leagueName,
    currentSeasonName: currentSeasonName,
    currentStageName: currentStageName,
    nextGame: nextGamePreview,
    userFavoritesFutureGames: futureFavorites

  };
}


exports.getLeagueDetails = getLeagueDetails;