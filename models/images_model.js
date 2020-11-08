/**
* A module to perform query's related with the property images on the database.
* @module models/images_model
* @author Gheorghe Craciun
*/
const db = require('../helpers/database');

/**
 * SQL Query function to get all images name for a property from the DB.
 * @param {integer} propID - property ID.
 * @returns {object} data - The response object containing all images name.
 */
exports.getAllImagesNamesForProperty = async function getAllImagesNamesForProperty(propID) {
    const query = 'SELECT * FROM propertiesImages WHERE prop_ID = ?';
    const data = await db.run_query(query, propID);
    return data;
};

/**
 * SQL Query function to get an image name by it's ID.
 * @param {integer} imageID - property ID.
 * @returns {object} data - The response object containing all images name.
 */
exports.getImageNameByImageID = async function getImageNameByImageID(imageID) {
    const query = 'SELECT imageName FROM propertiesImages WHERE imageID = ?';
    const data = await db.run_query(query, imageID);
    return data;
};

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

/**
 * SQL Query function to delete an image by it's ID.
 * @param {integer} imageID - image ID.
 * @returns {object} data - The response object.
 */
exports.deleteImageById = async function deleteImageById(imageID) {
    const query = 'DELETE FROM propertiesImages WHERE imageID = ?;';
    const data = await db.run_query(query, imageID);
    return data;
};
