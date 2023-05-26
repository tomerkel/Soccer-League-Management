var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const games_utils = require("./utils/games_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT userID FROM dbo.users")
      .then((users) => {
        if (users.find((x) => x.userID === req.session.user_id)) {
          req.user_id = req.session.user_id;
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    res.status(401).send("You are not logged in");
  }
});

/**
 * This path gets query with gameId and adds this game into logged-in user's favorites games
 * returns 404 if the game isn't exist in DB
 * returns 409 if the game already added to user's favorites
 */
router.post("/favorites/addGame", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const game_id = req.body.gameID;
      // parameters exist
    if (game_id == undefined){
      throw {status: 400, message: "Missing one or more parameters"};
    }
    // checks that the requested game exists in games DB
    await games_utils.getGameByID(game_id, true);
    // checks that the requested game exists in user favorites
    await users_utils.checkGameExistInUsersFavorites(user_id, game_id);
    await users_utils.markGameAsFavorite(user_id, game_id);
    res.status(201).send("The game successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns all favorites games that were saved by the logged-in user
 */
router.get("/favorites/getGames", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const futureFavorites = await users_utils.getUserFutureFavorites(user_id);
    res.status(200).send(futureFavorites);
  } catch (error) {
    next(error);
  }
});

router.get("/isAssoRep", async (req,res,next) => {
  try{
    const user_id =  req.session.user_id;
    const isAssoRep = await users_utils.isAssoRep(user_id);
    res.status(200).send(isAssoRep);
  }
  catch(error){
    next(error);
  }
})


module.exports = router;
