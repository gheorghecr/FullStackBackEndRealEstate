/* eslint-disable func-names */
/* eslint-disable no-console */
/**
* A module to handle Basic user authentication.
* @module strategies/basic
* @author Gheorghe Craciun
*/

const { BasicStrategy } = require('passport-http');

const bcrypt = require('bcrypt');

const users = require('../models/users_model');

/**
 * Function to very if 2 password are equal.
 * @param {object} user - User Object.
 * @param {string} password - Second Password.
 * @returns {bool} - True or false depending if password match or not.
 */
const verifyPassword = function (user, password) {
    return bcrypt.compareSync(password, user.password);
};

/**
 * Function to perform authentication (Login).
 * @param {string} username - User username.
 * @param {string} password - User Password.
 * @param {callback} done - Callback to be performed.
 * @returns {callback} done - call done() with either an error or the user, depending on outcome.
 */
const checkUserAndPass = async (username, password, done) => {
    let result;

    try {
    // look up the user and check the password if the user exists
        result = await users.findByUsername(username);
    } catch (error) {
        console.error(`Error during authentication for user ${username}`);
        return done(error);
    }
    if (result.length) {
        const user = result[0];
        // verify if user password matches.
        if (verifyPassword(user, password)) {
            console.log(`Successfully authenticated user ${username}`);
            return done(null, user);
        // eslint-disable-next-line no-else-return
        } else {
            console.log(`Password incorrect for user ${username}`);
        }
    } else {
        console.log(`Not found user with username: ${username}`);
    }
    return done(null, false); // username or password were incorrect
};

const strategy = new BasicStrategy(checkUserAndPass);

module.exports = strategy;
