/**
* A module to perform query's related with the categories on the database.
* @module models/categories_model
* @author Gheorghe Craciun
*/
const db = require('../helpers/database');

/**
 * SQL Query function to get all categories from the DB.
 * @returns {object} data - The response object containing all categories.
 */
exports.getAllCategories = async function getAllCategories() {
    const query = 'SELECT * FROM categories';
    const data = await db.run_query(query);
    return data;
}
