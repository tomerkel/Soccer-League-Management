const DButils = require("./DButils");
const teams_utils = require("./teams_utils")
const user_utils = require("./users_utils")

/**
 * Function that returns game preview or game's full details according to the value of preview parameter
 */
async function getGameByID(gameID, preview){
    let game;
    if (preview){
        game = await DButils.execQuery(
            `SELECT gameID, gameDateTime, homeTeamID, awayTeamID, stadium FROM dbo.games WHERE gameID='${gameID}'` 
        );
        if (game.length == 0) {
            throw { status: 404, message: "game isn't exist" };
        }
        // const gameToClient = await teams_utils.getTeamsPreviews(game[0]);
        return {
            gameID: game[0].gameID,
            gameDateTime: game[0].gameDateTime,
            homeTeamID: game[0].homeTeamID,
            awayTeamID: game[0].awayTeamID,
            stadium: game[0].stadium
        };
    }
    else{
        game = await DButils.execQuery(
            `SELECT gameID, gameDateTime, homeTeamID, awayTeamID, stadium, homeGoals, awayGoals, refereeID FROM dbo.games WHERE gameID='${gameID}'` 
        );
        if (game.length == 0) {
            throw { status: 404, message: "game isn't exist"};
        }
        //const teamsPreviews = await teams_utils.getTeamsPreviews(game[0]);
        const refereeName = await user_utils.getRefereeName(game[0].refereeID);
        const gameDetails = {
            gameID: game[0].gameID,
            gameDateTime: game[0].gameDateTime,
            homeTeamID: game[0].homeTeamID,
            awayTeamID: game[0].awayTeamID,
            stadium: game[0].stadium,
            homeGoals: game[0].homeGoals,
            awayGoals: game[0].awayGoals,
            referee: refereeName
        }
        gameEvents = await getGameEvents(gameID);
        game = {gameDetails: gameDetails, gameEventSchedule: gameEvents};
        return game;
    }
}

/**
 * Helper function that returns a list of gameID and gameDateTime ascendingly sorted by gameDateTime
 */
async function getSortedGamesByDate(){
    const games = await DButils.execQuery(
        `SELECT gameID, gameDateTime FROM dbo.games ORDER BY gameDateTime ASC` 
    );
    return games;
}

/**
 * Function that returns only future games from a mixed list including past games and future games objects
 */
async function getFutureGames(games){
    let futureGames = [];
    for(let i=0; i<games.length; i++){
        if (await isFutureGame(games[i])){
            let dbDate = new Date(games[i].gameDateTime);
            games[i].gameDateTime = dbDate;
            futureGames.push(games[i]);
        }
    }
    return futureGames;
}

/**
 * Helper function that returns true if game is a future games and false if it's a past games
 */
async function isFutureGame(game){
    const today = new Date();
    let dbDate = new Date(game.gameDateTime);
    dbDate.setHours(dbDate.getHours()-3);

    return dbDate.getTime() > today.getTime();
}

/**
 * Helper function that returns true if refereeID exists in referees table, else returens false
 */
async function isValidReferee(refID){
    const referees = await DButils.execQuery(
      "SELECT refereeID FROM dbo.referees"
    );
    if (referees.find((ref) => ref.refereeID === parseInt(refID))){
        return true;
    }
    return false;
}

/**
 * Function that returns all DB's games seperated by past games and future games
 */
async function getAllGames(){
    let allGames = await getSortedGamesByDate();
    if (allGames.length == 0){
        throw {status: 404, message: "Games not found"}
    }
    return await getSeperatedPastAndFutureGames(allGames);
}

/**
 * Helper function that seperates a given games list to 2 seperated lists: all future Games and all games History
 */
async function getSeperatedPastAndFutureGames(allGames){
    const futureGames = await getFutureGames(allGames);
    let futureGamesDetails = [];
    let pastGames = [];
    for (let i=0; i<futureGames.length; i++){
      const gamePreview = await getGameByID(futureGames[i].gameID, true);
      futureGamesDetails.push(gamePreview);
      let gameToRemove = allGames.find((g) => g.gameID == futureGames[i].gameID);
      const index = allGames.indexOf(gameToRemove);
      allGames.splice(index, 1);
    }
    for(let i=0; i<allGames.length; i++){
      const gameDetails = await getGameByID(allGames[i].gameID, false);
      pastGames.push(gameDetails);
    }
      
    return {
    futureGames: futureGamesDetails,
    gamesHistory: pastGames
    };
}

/**
 * Helper function that updates the row of gameID with the score
 */
async function setScore(gameID, homeGoals, awayGoals){
    await DButils.execQuery(
        `UPDATE dbo.games SET homeGoals='${homeGoals}', awayGoals='${awayGoals}' WHERE gameID='${gameID}'`
      );
}

/**
 * Helper function that adds row of event in gamesEvents table after check if the event is not exist
 */
async function addEventToGame(gameID, gameDate, gameHour, gameMinute, eventType, description){
    const gameEvent = await DButils.execQuery(
        `SELECT gameID, gameMinute, eventType, description FROM dbo.gamesEvents WHERE gameID='${gameID}' AND gameMinute='${gameMinute}' AND eventType='${eventType}' AND description='${description}'` 
    );
    if (gameEvent.length > 0){
        throw {status: 409, message: "Event already exist"}
    }
    await DButils.execQuery(
        `INSERT INTO dbo.gamesEvents (gameID, gameDate, gameHour, gameMinute, eventType, description) VALUES ('${gameID}', '${gameDate}', '${gameHour}', '${gameMinute}', '${eventType}', '${description}')`
      );
}

/**
 * Helper function that returns all game's events (gameEventSchedule)
 */
async function getGameEvents(gameID){
    const gameEvents = await DButils.execQuery(
        `SELECT eventID, gameDate, gameHour, gameMinute, eventType, description FROM dbo.gamesEvents WHERE gameID='${gameID}'` 
    );
    return gameEvents;
}



exports.isFutureGame = isFutureGame;
exports.setScore = setScore;
exports.addEventToGame = addEventToGame;
exports.getGameByID = getGameByID;
exports.getSortedGamesByDate = getSortedGamesByDate;
exports.getFutureGames = getFutureGames;
exports.isValidReferee = isValidReferee;
exports.getAllGames = getAllGames;
exports.getSeperatedPastAndFutureGames = getSeperatedPastAndFutureGames;


