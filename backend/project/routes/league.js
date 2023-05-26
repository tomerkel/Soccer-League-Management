var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");

/**
 * This path returns full details of the SUPERLEAGU
 * In addition returns favorites games for logged-in users
 */
router.get("/getDetails", async (req, res, next) => {
  try {
    let user_id;
    if (req.session && req.session.user_id) {
      user_id = req.session.user_id;
    }
    const league_details = await league_utils.getLeagueDetails(user_id);
    res.status(200).send(league_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
