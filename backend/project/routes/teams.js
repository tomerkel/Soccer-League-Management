var express = require("express");
var router = express.Router();
const teams_utils = require("./utils/teams_utils");

/**
 * This path gets query with teamName and returns a list with all matching resutls
 * returns 404 if there are no results
 */
router.get("/search/:teamName", async (req, res, next) => {
  try {
    const team_preview = await teams_utils.getTeamPreviewByName(
      req.params.teamName
    );
    if (team_preview.length == 0){
      res.status(404).send("Team not found");
    }
    res.status(200).send(team_preview);
  } catch (error) {
    next(error);
  }
});

/**
 * This path gets query with teamId and returns full details of the matching team: teamName, logo, team's players preview, gamesHisory and futureGames
 * returns 404 if the team doesn't belong to SUPERLEAGUE
 */
router.get("/teamFullDetails/:teamID", async (req, res, next) => {
  try {
    if (! await teams_utils.checkValidLeague(req.params.teamID)){
      throw { status: 404, message: "Team doesn't belong to SUPERLEAGUE"};
    }
    //const teamNameAndLogo = await teams_utils.getTeamNameAndLogo(req.params.teamID);
    const teamDetails = await teams_utils.getTeamDetails(req.params.teamID);
    res.status(200).send(teamDetails);
  } catch (error) {
    next(error);
  }
});




module.exports = router;
