var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const games_utils = require("./utils/games_utils");
const teams_utils = require("./utils/teams_utils");

/**
 * This path gets query with gameId and returns full details of the matching game
 * returns 404 if the game isn't exist in DB
 */
router.get("/gameDetails/:gameID", async (req, res, next) => {
    try {
        const gameID = req.params.gameID;
        const game = await games_utils.getGameByID(gameID, false);
        res.status(200).send(game);
    }
    catch (error) {
        next(error);
      }
  });

  /**
 * This path returns DB'S games seperated into 2 lists: futureGames and gamesHistory
 */
router.get("/allGames", async (req, res, next) => {
    try {
        const allGames = await games_utils.getAllGames();
        res.status(200).send(allGames);
    }
    catch (error) {
        next(error);
      }
  });


  module.exports = router;