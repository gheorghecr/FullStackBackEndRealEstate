/**
* A module to perform query's related with the features on the database.
* @module models/features_model
* @author Gheorghe Craciun
*/
const db = require('../helpers/database');

/**
 * SQL Query function to get all features from the DB.
 * @returns {object} data - The response object containing all features.
 */
exports.getAllFeatures = async function getAllFeatures() {
    const query = 'SELECT * FROM features';
    const data = await db.run_query(query);
    return data;
};
