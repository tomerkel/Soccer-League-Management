const DButils = require("./DButils");
const games_utils = require("./games_utils");
const bcrypt = require("bcryptjs");

/**
 * Helper function that insert favorite game (by ID) to usersFavoriteGames table
 */
async function markGameAsFavorite(user_id, game_id) {
  await DButils.execQuery(
    `INSERT INTO usersFavoriteGames values ('${user_id}',${game_id})`
  );
}


/**
 * Helper function that returns all favorites games ID's of user
 */
async function getFavoriteGames(user_id) {
  const game_ids = await DButils.execQuery(
    `SELECT gameID from usersFavoriteGames WHERE userID='${user_id}'`
  );
  return game_ids;
}

/**
 * Helper function that checks if game that matching to game_id exist in usersFavoritesGames
 */
async function checkGameExistInUsersFavorites(user_id, game_id) {
  const game_ids = await DButils.execQuery(
    `SELECT gameID from usersFavoriteGames WHERE userID='${user_id}' AND gameID='${game_id}'`
  );
  if (game_ids.length > 0) {
    throw { status: 409, message: "game already exist in user favorites" };
  }
  return game_ids;
}

/**
 * Helper function that returns a list of game preview objects according to a given game ID's list
 */
async function getGames(game_ids){
  let res = [];
  for (let i=0; i<game_ids.length; i++){
    res.push(await games_utils.getGameByID(game_ids[i].gameID, true));
  }
  return res;
}

/**
 * Function that returns a list of game preview objects according to a given game ID's list
 */
async function getUserFutureFavorites(user_id){
  const game_ids = await getFavoriteGames(user_id);
  const results = await getGames(game_ids);
  const futureFavorites = await games_utils.getFutureGames(results);
  return futureFavorites;
}

/**
 * Helper function that returns true if user exists in users table, else returns false
 */
async function checkIfUserExist(userID){
  const user = await DButils.execQuery(
    `SELECT * FROM dbo.users WHERE userID ='${userID}'`
  );
  if (user.length == 0){
    return false;
  }
  return true;
}

/**
 * Helper function that inserts representative in to associationsRepresentatives table
 */
async function addRepresentative(userID){
  const userExist = await checkIfUserExist(userID);
  if (!userExist){
    throw { status: 409, message: "There is no user with id " + userID}
  }

  const representatives = await DButils.execQuery(
    `SELECT * FROM dbo.associationRepresentatives WHERE userID ='${userID}'`
  );

  if (representatives.length == 0){
    await DButils.execQuery(
      `INSERT INTO dbo.associationRepresentatives (userID) VALUES ('${userID}')`
    );
  }
}

/**
 * Helper function that inserts 2 default representatives to the DB in order to allow admin's actions
 */
async function addDefaultRepresentatives(){
  let hash_password = bcrypt.hashSync(
    "#admin1",
    parseInt(process.env.bcrypt_saltRounds)
  );
  
  const userOneExist = await checkIfUserExist(1);
  const userTwoExist = await checkIfUserExist(2);

  // add the new username
  if (!userOneExist){
    await DButils.execQuery(
      `INSERT INTO dbo.users (userName, hashPassword, firstName, lastName, country, email, imageUrl) VALUES ('${"adminone"}', '${hash_password}', '${"admin"}', '${"one"}', '${"Israel"}', '${"adminone@gmail.com"}', '${"./images/adminone.jpg"}')`
    );
  }

  if (!userTwoExist){
    await DButils.execQuery(
      `INSERT INTO dbo.users (userName, hashPassword, firstName, lastName, country, email, imageUrl) VALUES ('${"admintwo"}', '${hash_password}', '${"admin"}', '${"two"}', '${"Israel"}', '${"admintwo@gmail.com"}', '${"./images/admintwo.png"}')`
    );
  }

  await addRepresentative(1);
  await addRepresentative(2);
}

/**
 * Helper function that inserts 3 default users to the DB in order to allow referees actions
 */
async function addDefaultUsers(){
  for(let i=3; i<6; i++){
    if (! await checkIfUserExist(i)){
      let hash_password = bcrypt.hashSync(
        "#user"+i,
        parseInt(process.env.bcrypt_saltRounds)
      );
      await DButils.execQuery(
        `INSERT INTO dbo.users (userName, hashPassword, firstName, lastName, country, email, imageUrl) VALUES ('${"user"+i}', '${hash_password}', '${"default"}', '${"user"+i}', '${"Israel"}', '${"user"+i+"@gmail.com"}', '${"./images/adminone.jpg"}')`
      );
    } 
  }  
 }

/**
 * Helper function that inserts 2 default referees
 */ 
async function addDefaultreferees(){
  for(let i=1; i<3; i++){
    if (!await games_utils.isValidReferee(i)){
      await DButils.execQuery(
        `INSERT INTO dbo.referees (userID, qualification) VALUES ('${i+2}', '${"master"}')`
      );
    } 
  }  
}

/**
 * Function that inserts default users, representatives and referees to the DB
 */
 async function initializeDefaultsInDB(){
  await addDefaultRepresentatives();
  await addDefaultUsers();
  await addDefaultreferees();
}

async function getRefereeName(refereeID){
  const refereeUserID = await DButils.execQuery(
    `SELECT userID FROM dbo.referees WHERE refereeID ='${refereeID}'`
  )
  const name = await DButils.execQuery(
    `SELECT firstName, lastName FROM dbo.users WHERE userID ='${refereeUserID[0].userID}'`
  )
  const refereeName = name[0].firstName + " " + name[0].lastName;
  return refereeName;
}

async function isAssoRep(userID){
  const user = await DButils.execQuery(
    `SELECT * FROM dbo.associationRepresentatives WHERE userID ='${userID}'`
  )
  return user.length > 0;
}

exports.isAssoRep = isAssoRep;
exports.getRefereeName = getRefereeName;
exports.initializeDefaultsInDB = initializeDefaultsInDB;
exports.markGameAsFavorite = markGameAsFavorite;
exports.getFavoriteGames = getFavoriteGames;
exports.getGames = getGames;
exports.checkGameExistInUsersFavorites = checkGameExistInUsersFavorites;
exports.getUserFutureFavorites = getUserFutureFavorites;
exports.checkIfUserExist = checkIfUserExist;
