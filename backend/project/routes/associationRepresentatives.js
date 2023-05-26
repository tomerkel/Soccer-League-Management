var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users = require("./utils/users_utils");
const teams_utils = require("./utils/teams_utils")
const games_utils = require("./utils/games_utils")


/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT userID FROM dbo.associationRepresentatives")
      .then((reprs) => {
        if (reprs.find((x) => x.userID === req.session.user_id)) {
          req.user_id = req.session.user_id;
          next();
        }
        else {
          throw { status: 401, message: "Currently logged-in user doesn't have the right permissions"};
        }
      })
      .catch((err) => next(err));
  } else {
    res.status(401).send("You are not logged in");
  }
});

/**
 * BONUS
 * This path gets query with body params and creates new referee user for an existing user
 * returns 400 if there is at least one missing parameter
 * returns 409 in case that there is no user with the given userID or that this referee already exist
 */
router.post("/addReferee", async (req, res, next) => {
    try {
        const {userID, qualification} = req.body;

        // parameters exist
        if (userID == undefined){
          throw {status: 400, message: "Missing one or more parameters"};
        }

        const userExist = await users.checkIfUserExist(userID);
        if (!userExist){
          throw { status: 409, message: "There is no user with id " + userID}
        }

        const refs = await DButils.execQuery(
            "SELECT userID FROM dbo.referees" 
        );
        if (refs.find((r) => r.userID === parseInt(userID))){
            throw { status: 409, message: "referee already exist"}
        }

        await DButils.execQuery(
          `INSERT INTO dbo.referees (userID, qualification) VALUES ('${userID}', '${qualification}')`
        );

        const refereeID = await DButils.execQuery(
          `SELECT refereeID FROM dbo.referees WHERE userID='${userID}'`
        );
            
        res.status(201).send("referee created successfully, The referee ID is " + refereeID[0].refereeID);
    } 
    catch (error) {
      next(error);
    }
});

/**
 * This path gets query with body params and creates new game
 * returns 400 if there is at least one missing parameter
 * returns 400 if homeTeam\awayTeam doesn't belong to SUPELEAGUE\ home and away team are the same
 * returns 409 if homeTeam\awayTeam already has another game on the same date
 * returns 409 if the given refereeID doesn't belont to a legal referee
 */
router.post("/addGame", async (req, res, next) => {
  try {
      const {gameDateTime, homeTeam, awayTeam, stadium, referee} = req.body;

      // parameters exists
      if (gameDateTime == undefined || homeTeam == undefined || awayTeam == undefined || stadium == undefined || referee == undefined){
        throw {status: 400, message: "Missing one or more parameters"};
      }

      const games = await DButils.execQuery(
          "SELECT CONVERT(Char(16), gameDateTime ,20) AS gameDateTime , homeTeamID, awayTeamID FROM dbo.games" 
      );
      
      const validHomeTeam = await teams_utils.checkValidLeague(homeTeam);
      const validAwayTeam = await teams_utils.checkValidLeague(awayTeam);

      if (!validHomeTeam){
          throw { status: 404, message: "homeTeam doesn't belong to SUPERLEAGUE"};
      }

      if (!validAwayTeam){
          throw { status: 404, message: "awayTeam doesn't belong to SUPERLEAGUE"};
      }

      if (homeTeam === awayTeam){
          throw { status: 400, message: "Team can't play against itself"};
      }

      // check if need to check that home is not in away team becuase we dont that team will have more than 1 game per day
      if (games.find((g) => (new Date(g.gameDateTime).getTime()===new Date(gameDateTime).getTime() && (g.homeTeamID === parseInt(homeTeam) || g.awayTeamID === parseInt(awayTeam))))){
          throw { status: 409, message: "one or both teams already play in another game on this date"}
      }

      if (! await games_utils.isValidReferee(referee)){
          throw { status: 404, message: "Any game must have a legal regeree from referees table" };
      }

      await DButils.execQuery(
        `INSERT INTO dbo.games (gameDateTime, homeTeamID, awayTeamID, stadium, refereeID) VALUES ('${gameDateTime}', '${homeTeam}', '${awayTeam}', '${stadium}', '${referee}')`
      );
      
      res.status(201).send("The game successfully saved in DataBase");
  } 
  catch (error) {
    next(error);
  }
});

/**
 * BONUS
 * This path gets query with body params and update the game row in DB
 * returns 400 if there is at least one missing parameter
 * returns 404 if the game not found
 * returns 409 if the game is in the future
 */
router.post("/addScoreToGame", async (req, res, next) => {
  try{
    const {gameID, homeGoals, awayGoals} = req.body;
    if (gameID == undefined || homeGoals == undefined || awayGoals == undefined){
      throw {status: 400, message: "Missing one or more parameters"};
    }
    let game = await games_utils.getGameByID(gameID, false);
    const isFuture = await games_utils.isFutureGame(game.gameDetails);
    if (isFuture){
      throw {status: 409, message: "Can't add result to a future game"}
    }
    games_utils.setScore(gameID, homeGoals, awayGoals);
    game.homeGoals = homeGoals;
    game.awayGoals = awayGoals;
    res.status(201).send("The score successfully saved in DataBase");
  }
  catch(error){
    next(error);
  }
})

/**
 * BONUS
 * This path gets query with body params and add event to game 
 * returns 400 if there is at least one missing parameter
 * returns 404 if the game not found
 * returns 409 if the game is in the future
 */
router.post("/addEventToGame", async (req, res, next) => {
  try{
    const {gameID, gameMinute, eventType, description} = req.body;
    if (gameID == undefined || gameMinute == undefined || eventType == undefined || description == undefined){
      throw {status: 400, message: "Missing one or more parameters"};
    }
    let game = await games_utils.getGameByID(gameID, true);
    const isFuture = await games_utils.isFutureGame(game);
    if (isFuture){
      throw {status: 409, message: "Can't add event to a future game"}
    }
    const gameDate = game.gameDateTime.toISOString().split('T')[0];
    const gameHour = game.gameDateTime.toISOString().split('T')[1].split('.')[0];
    await games_utils.addEventToGame(gameID, gameDate, gameHour, gameMinute, eventType, description);
    res.status(201).send("The event successfully added");
  }
  catch(error){
    next(error);
  }
})

/**
 * This path returns all association representatives in the DB
 */
router.get("/allRepresentatives", async (req, res, next) => {
  try {
    const representatives = await DButils.execQuery(
        "SELECT representativeID FROM dbo.associationRepresentatives" 
    );
    if (representatives.length == 0){
      throw {status: 404, message: "Representatives not found"}
    }
    res.status(200).send(representatives);
  }
  catch (error) {
      next(error);
    }
});

module.exports = router;