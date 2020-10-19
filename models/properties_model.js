/**
* A module to perform querys related with the properties on the database.
* @module models/properties_model
* @author Gheorghe Craciun
*/
const db = require('../helpers/database');

/**
 * SQL Query function to get all properties that are visible from the DB.
 * @returns {object} data - The response object containing all properties data.
 */
exports.getAll = async function getAll() {
  const query = 'SELECT * FROM properties WHERE visibility = 1';
  const data = await db.run_query(query);
  return data;
}

/**
 * SQL Query function to get all properties (Admin view) from the DB.
 * @returns {object} data - The response object containing all properties data.
 */
exports.getAllAdminView = async function getAllAdminView() {
  const query = 'SELECT * FROM properties';
  const data = await db.run_query(query);
  return data;
}

/**
 * SQL Query function to get an property details by it's ID.
 * @returns {object} data - The response object containing the property details.
 */
exports.getPropByID = async function getPropByID(propID) {
  const query = 'SELECT * FROM properties WHERE prop_ID = ?';
  const data = await db.run_query(query, propID);
  return data;
}

/**
 * SQL Query function to get all properties that have high priority from the DB.
 * @returns {object} data - The response object containing a list of properties with high priority.
 */
exports.getPropHighPriority = async function getPropHighPriority() {
  const query = 'SELECT * FROM properties WHERE highPriority = 1';
  const data = await db.run_query(query);
  return data;
}