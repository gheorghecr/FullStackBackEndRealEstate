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

/**
 * SQL Query function to get the features for a given property.
 * @param {integer} id - property ID.
 * @returns {object} data - The response object containing all features for a given property.
 */
exports.getFeaturesForProperty = async function getFeaturesForProperty(id) {
    let query = 'SELECT f.ID, pf.propertyFeatureID, f.name FROM propertyFeatures as pf INNER JOIN features AS f';
    query += ' ON pf.featureID = f.ID WHERE pf.propertyID = ?;';
    const result = await db.run_query(query, id);
    return result;
};

/**
 * SQL Query function to add a feature.
 * @param {object} feature - The feature object.
 * @returns {object} data - The response object.
 */
exports.addFeatures = async function addFeatures(feature) {
    const query = 'INSERT INTO features SET ?;';
    const data = await db.run_query(query, feature);
    return data;
};

/**
 * SQL Query function to delete a feature by it's ID.
 * @param {integer} id - feature ID.
 * @returns {object} data - The response object.
 */
exports.deleteFeatureById = async function deleteFeatureById(id) {
    const query = 'DELETE FROM features WHERE ID = ?;';
    const data = await db.run_query(query, id);
    return data;
};

/**
 * SQL Query function to update the features by it's ID.
 * @param {integer} id - featureID.
 * @param {integer} feature - feature Object.
 * @returns {object} data - The response object.
 */
exports.updateFeature = async function updateFeature(id, feature) {
    const query = 'UPDATE features SET ? WHERE ID = ?';
    const values = [feature, id];
    const data = await db.run_query(query, values);
    return data;
};

/**
 * SQL Query function to add the features to a property by property ID and feature ID.
 * @param {integer} propertyID - property ID.
 * @param {integer} featureID - feature ID .
 * @returns {object} data - The response object.
 */
exports.addFeatureForProperty = async function addFeatureForProperty(propertyID, featureID) {
    const dataToInsert = { propertyID, featureID };
    const query = 'INSERT INTO propertyFeatures SET ?';
    const values = [dataToInsert];
    const data = await db.run_query(query, values);
    return data;
};

/**
 * SQL Query function to delete a property feature by propertyFeatureID.
 * @param {integer} propertyFeatureID - propertyFeatureID.
 * @returns {object} data - The response object.
 */
exports.deletePropertyFeature = async function deletePropertyFeature(propertyFeatureID) {
    const query = 'DELETE FROM propertyFeatures WHERE propertyFeatureID = ?;';
    const data = await db.run_query(query, propertyFeatureID);
    return data;
};
