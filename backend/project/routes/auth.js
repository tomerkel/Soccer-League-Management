var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcryptjs");

/**
 * This path gets query with body params and creates new user accordingly
 * returns 400 if there is at least one missing parameter
 * returns 409 in case that username already taken
 */
router.post("/Register", async (req, res, next) => {
  try {
    let bodyParams = req.body;
    // parameters exist
    if (bodyParams.username == undefined || bodyParams.password == undefined || bodyParams.firstName == undefined || bodyParams.lastName == undefined || bodyParams.country == undefined || bodyParams.email == undefined || bodyParams.imageUrl == undefined){
      throw {status: 400, message: "Missing one or more parameters"};
    }

    const users = await DButils.execQuery(
      "SELECT username FROM dbo.users"
    );

    if (users.find((x) => x.username === bodyParams.username.toLowerCase()))
      throw { status: 409, message: "Username taken" };

    //hash the password
    let hash_password = bcrypt.hashSync(
      bodyParams.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    bodyParams.password = hash_password;

    // add the new username
    await DButils.execQuery(
      `INSERT INTO dbo.users (userName, hashPassword, firstName, lastName, country, email, imageUrl) VALUES ('${ bodyParams.username}', '${ bodyParams.password}', '${bodyParams.firstName}', '${bodyParams.lastName}', '${bodyParams.country}', '${bodyParams.email}', '${bodyParams.imageUrl}')`
    );
    
    const userID = await DButils.execQuery(
      `SELECT userID FROM dbo.users WHERE userName='${bodyParams.username}'`
    );

    res.status(201).send("user created successfully, Your ID is " + userID[0].userID);
  } catch (error) {
    next(error);
  }
});

/**
 * This path gets query with body params and sets session cookie in case of success login
 * returns 401 in case thae username or password are incorrect
 */
router.post("/Login", async (req, res, next) => {
  try {
    // parameters exist
    if (req.body.username == undefined || req.body.password == undefined){
      throw {status: 400, message: "Missing one or more parameters"};
    }

    const user = (
      await DButils.execQuery(
        `SELECT * FROM dbo.users WHERE userName = '${req.body.username}'`))[0];

    // check that username exists & the password is correct
    if (!user || !bcrypt.compareSync(req.body.password, user.hashPassword)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.user_id = user.userID;

    // return cookie
    res.status(200).send("login succeeded");
  } catch (error) {
    next(error);
  }
});

/**
 * This path executes logout - reset session
 */
router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.status(200).send("logout succeeded");
});

module.exports = router;
