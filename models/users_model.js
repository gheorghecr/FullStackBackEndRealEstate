/**
* A module to perform querys on the database.
* @module models/user_model
* @author Gheorghe Craciun
*/
const db = require('../helpers/database');

/**
 * SQL Query function to gett all users from the DB.
 * @returns {object} data - The response object containing all users personal data.
 */
exports.getAll = async function getAll () {
  let query = "SELECT * FROM users";
  let data = await db.run_query(query);
  return data;
}

/**
 * SQL Query function to get a single user personal data by the (unique) username.
 * @param {string} username - User username.
 * @returns {object} data - The response object containing a single user personal info.
 */
exports.findByUsername = async function findByUsername (username) {
  let query = "SELECT * FROM users WHERE username = ?";
  let data = await db.run_query(query, username);
  return data;
}


/**
 * SQL Query function to get a single user personal data by the (unique) userID.
 * @param {int} id - User ID.
 * @returns {object} data - The response object containing a single user personal info.
 */
exports.getUserInfoById = async function getUserInfoById (id) {
  // TODO: use page, limit, order to give pagination
  let query = "SELECT * FROM users WHERE userID = ?;"; 
  let values = [id];
  let data = await db.run_query(query, values); 
  return data;
}

/**
 * SQL Query function to create an user account.
 * @param {object} user - User Object.
 * @returns {object} data - The response object.
 */
exports.register = async function register (user) {
  let query = "INSERT INTO users SET ?"; 
  let data = await db.run_query(query, user); 
  return data;
}

/**
 * SQL Query function to update an user personal information.
 * @param {int} id - User ID.
 * @param {object} user - User Object.
 * @returns {object} data - The response object.
 */
exports.updateById = async function updateById (id, user) {
  let query = "UPDATE users SET ? WHERE userID = ?";
  let values = [user, id];
  let data = await db.run_query(query, values); 
  return data;
}

/**
 * SQL Query function delete an user account.
 * @param {int} id - User ID.
 * @returns {object} data - The response object.
 */
exports.deleteAccountById = async function deleteAccountById (id) {
  let query = "DELETE FROM users WHERE userID = ?";
  let values = [id];
  let data = await db.run_query(query, values);
  return data;
}