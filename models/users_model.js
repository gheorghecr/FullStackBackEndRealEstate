const db = require('../helpers/database');


//get All users info
exports.getAll = async function getAll () {
  let query = "SELECT * FROM users";
  let data = await db.run_query(query);
  return data;
}

//get a single user by the (unique) username
exports.findByUsername = async function findByUsername (usarname) {
  let query = "SELECT * FROM users WHERE username = ?";
  let data = await db.run_query(query, usarname);
  return data;
}

//get user info by ID
exports.getUserInfoById = async function getUserInfoById (id) {
  // TODO: use page, limit, order to give pagination
  let query = "SELECT * FROM users WHERE userID = ?;"; 
  let values = [id];
  let data = await db.run_query(query, values); 
  return data;
}

//Create account 
exports.register = async function register (user) {
  let query = "INSERT INTO users SET ?"; 
  let data = await db.run_query(query, user); 
  return data;
}

//update information
exports.updateById = async function updateById (id, article) {
  let query = "UPDATE users SET ? WHERE userID = ?";
  let values = [article, id];
  let data = await db.run_query(query, values); 
  return data;
}


//delete user account by ID
exports.deleteAccountById = async function deleteAccountById (id) {
  let query = "DELETE FROM users WHERE userID = ?";
  let values = [id];
  let data = await db.run_query(query, values);
  return data;
}