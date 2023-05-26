const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const LEAGUE_ID = 271;

/**
 * Helper function that returns a list of all team's players ID's according to the parameter team_id
 */
async function getPlayerIdsByTeam(team_id) {
  let player_ids_list = [];
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      include: "squad",
      api_token: process.env.api_token,
    },
  });
  if (team.data.data && team.data.data.squad && team.data.data.squad.data){
    team.data.data.squad.data.map((player) =>
    player_ids_list.push(player.player_id)
    );
  }
  return player_ids_list;
}

/**
 * Helper function that returns a list of all players full details from sportmonks API according to the parameter player_ids_list
 */
async function getPlayersInfo(players_ids_list) {
  let promises = [];
  players_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/players/${id}`, {
        params: {
          api_token: process.env.api_token,
          include: "team.league",
        },
      })
    )
  );
  let players_info = await Promise.all(promises);
  return players_info;
}

/**
 * Helper function that returns a list of all players preview from a given list of players according to the parameter players_info_list
 */
async function getPlayerPreview(players_info_list) {
  let playersList = [];
  players_info_list.map((player_info) => {
    if (player_info.data.data){
      const {player_id, fullname, image_path, position_id } = player_info.data.data;
      // const {fullname, image_path, position_id } = player_info.data.data;
      if (player_info.data.data.team && player_info.data.data.team.data){
        const { name, short_code } = player_info.data.data.team.data;
        if (player_info.data.data.team.data.league && player_info.data.data.team.data.league.data){
          const { id } = player_info.data.data.team.data.league.data;
          if (id == LEAGUE_ID){
            playersList.push({
              playerID: player_id,
              name: fullname,
              image: image_path,
              position: position_id,
              teamName: name,
              teamShortCode: short_code
              })
          };
        }
      }
    }
  });
  return playersList;
}

/**
 * Helper function that returns a list of all players full details from a given list of players according to the parameter players_info_list
 */
async function getPlayerDetails(players_info_list) {
  playersList = [];
  players_info_list.map((player_info) => {
    if (player_info.data.data){
      const { fullname, image_path, position_id, common_name, nationality, birthdate, birthcountry, height, weight} = player_info.data.data;
      if (player_info.data.data.team && player_info.data.data.team.data){
        const { name } = player_info.data.data.team.data;
          if (player_info.data.data.team.data.league && player_info.data.data.team.data.league.data){
            const { id } = player_info.data.data.team.data.league.data;
            if (id == LEAGUE_ID){
              playersList.push({
                name: fullname,
                imageUrl: image_path,
                positionNumber: position_id,
                teamName: name,
                commonName: common_name,
                nationality: nationality,
                birthDate: birthdate,
                birthCountry: birthcountry,
                height: height,
                weight: weight
                })
            };
          }
      }
    }
  });
  return playersList;
}

/**
 * Function that returns a list of all team's players preview according to the parameter team_id
 */
async function getPlayersByTeam(team_id) {
  let player_ids_list = await getPlayerIdsByTeam(team_id);
  let players_info = await getPlayersInfo(player_ids_list);
  return await getPlayerPreview(players_info);
}

/**
 * Function that returns player preview according to player_id
 */
async function getPlayerPreviewByID(player_id) {
  let playerID = [player_id];
  let players_info = await getPlayersInfo(playerID);
  return await getPlayerPreview(players_info);
}

/**
 * Function that returns player full details according to player_id
 */
async function getPlayerByID(player_id) {
  let playerID = [player_id];
  let players_info = await getPlayersInfo(playerID);
  return await getPlayerDetails(players_info);
}

/**
 * Function that returns a list of results matching to player name and filterd by player position and player's teamFullName if requested
 */
async function getPlayerPreviewByName(playerName, queryParams) {
  let playersList = [];
  let positionFilter = queryParams.position;
  let teamFilter = queryParams.teamFullName;
  const players = await axios.get(`${api_domain}/players/search/${playerName}`, {
    params: {
      include: "team.league",
      api_token: process.env.api_token,
    },
  });
  if (players.data.data){
    players.data.data.map((player) => {
      const { player_id, fullname, image_path, position_id } = player;
      if (player.team && player.team.data){
        const { name, short_code } = player.team.data;
        if (player.team.data.league && player.team.data.league.data){
          const { id } = player.team.data.league.data;
          if (id == LEAGUE_ID && (fullname.toLowerCase().includes(playerName.toLowerCase()))){
            playersList.push({
              id: player_id,
              name: fullname,
              image: image_path,
              position: position_id,
              teamName: name,
              teamShortName: short_code,
              })
          };
        }
      }  
    });
  }
  if (positionFilter != undefined){
    playersList = await filterResultsByPosition(playersList, positionFilter);
  }
  if(teamFilter != undefined){
    playersList = await filterResultsByTeamName(playersList, teamFilter);
  }
  return playersList;
}

/**
 * Helper function that returns a filtered list of all players with a matchin positionFilter from a given playersList
 */
async function filterResultsByPosition(playersList, positionFilter){
  filteredResults = [];
  playersList.map((player) => {
    if (player.position == positionFilter){
      filteredResults.push(player);
    }
  });
  return filteredResults;
}

/**
 * Helper function that returns a filtered list of all players with a matchin teamFilter from a given playersList
 */
async function filterResultsByTeamName(playersList, teamFilter){
  filteredResults = [];
  playersList.map((player) => {
    if (player.teamName == teamFilter || player.teamShortName == teamFilter){
      filteredResults.push(player);
    }
  });
  return filteredResults;
}

exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.getPlayerPreview = getPlayerPreviewByID;
exports.getPlayerDetails = getPlayerByID;
exports.searchPlayersByName = getPlayerPreviewByName;
