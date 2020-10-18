/**
* A module to perform querys related with the properties on the database.
* @module models/properties_model
* @author Gheorghe Craciun
*/
const db = require('../helpers/database');

/**
 * SQL Query function to gett all properties from the DB.
 * @returns {object} data - The response object containing all properties data.
 */
exports.getAll = async function getAll() {
  const query = 'SELECT * FROM properties';
  const data = await db.run_query(query);
  return data;
}