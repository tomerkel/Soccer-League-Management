var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");

/**
 * This path gets query with playerId and returns preview of the matching player
 * returns 404 if the player doesn't belong to SUPERLEAGU
 */
router.get("/playerPreview/:playerId", async (req, res, next) => {
  try {
    const playerPreview = await players_utils.getPlayerPreview(
      req.params.playerId
    );
    if (playerPreview.length > 0){
      res.status(200).send(playerPreview[0]);
    }
    else{
      throw { status: 404, message: "Player doesn't belong to SUPERLEAGUE"};
    }
  } catch (error) {
    next(error);
  }
});

/**
 * This path gets query with playerID and returns full details of the matching player
 * returns 404 if the player doesn't belong to SUPERLEAGU
 */
router.get("/playerDetails/:playerID", async (req, res, next) => {
  try {
    const playerDetails = await players_utils.getPlayerDetails(
      req.params.playerID
    );
    if (playerDetails.length > 0){
      res.status(200).send(playerDetails[0]);
    }
    else{
      throw { status: 404, message: "Player doesn't belong to SUPERLEAGUE"};
    }
  } catch (error) {
    next(error);
  }
});

/**
 * This path gets query with playerName and optional query params for filtering results
 * and returns a filterd list with all matching resutls
 * returns 404 if there are no results
 */
router.get("/search/:playerName", async (req, res, next) => {
  try {
    const player_previews = await players_utils.searchPlayersByName(
      req.params.playerName, req.query
    );
    if (player_previews.length > 0){
      res.status(200).send(player_previews);
    }
    else{
      throw { status: 404, message: "Player not found"};
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;