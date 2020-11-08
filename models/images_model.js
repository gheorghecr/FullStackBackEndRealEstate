/**
* A module to perform query's related with the property images on the database.
* @module models/images_model
* @author Gheorghe Craciun
*/
const db = require('../helpers/database');

// /**
//  * SQL Query function to get all features from the DB.
//  * @returns {object} data - The response object containing all features.
//  */
// exports.getAllFeatures = async function getAllFeatures() {
//     const query = 'SELECT * FROM features';
//     const data = await db.run_query(query);
//     return data;
// };

// /**
//  * SQL Query function to get the features for a given property.
//  * @param {integer} id - property ID.
//  * @returns {object} data - The response object containing all features for a given property.
//  */
// exports.getFeaturesForProperty = async function getFeaturesForProperty(id) {
//     let query = 'SELECT f.ID, f.name FROM propertyFeatures as pf INNER JOIN features AS f';
//     query += ' ON pf.featureID = f.ID WHERE pf.propertyID = ?;';
//     const result = await db.run_query(query, id);
//     return result;
// };

/**
 * SQL Query function to store the image name for a property on the database.
 * @param {propID} propID - The property ID.
 * @param {imageName} imageName - The image name.
 * @returns {object} data - The response object.
 */
exports.storeImageName = async function storeImageName(propID, imageName) {
    const query = 'INSERT INTO propertiesImages SET prop_ID = ?, imageName = ?;';
    const values = [propID, imageName];
    const data = await db.run_query(query, values);
    return data;
};

// /**
//  * SQL Query function to delete a feature by it's ID.
//  * @param {integer} id - feature ID.
//  * @returns {object} data - The response object.
//  */
// exports.deleteFeatureById = async function deleteFeatureById(id) {
//     const query = 'DELETE FROM features WHERE ID = ?;';
//     const data = await db.run_query(query, id);
//     return data;
// };
