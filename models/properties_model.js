/* eslint-disable camelcase */
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
};

/**
 * SQL Query function to get all properties (Admin view) from the DB.
 * @returns {object} data - The response object containing all properties data.
 */
exports.getAllAdminView = async function getAllAdminView() {
    const query = 'SELECT * FROM properties';
    const data = await db.run_query(query);
    return data;
};

/**
 * SQL Query function to get an property details by it's ID.
 * @param {integer} propID - property ID.
 * @returns {object} data - The response object containing the property details.
 */
exports.getPropByID = async function getPropByID(propID) {
    const query = 'SELECT * FROM properties WHERE prop_ID = ?';
    const data = await db.run_query(query, propID);
    return data;
};

/**
 * SQL Query function to get all properties that have high priority from the DB.
 * @returns {object} data - The response object containing a list of properties with high priority.
 */
exports.getPropHighPriority = async function getPropHighPriority() {
    const query = 'SELECT * FROM properties WHERE highPriority = 1';
    const data = await db.run_query(query);
    return data;
};

/**
 * SQL Query function to get all properties that are listed by an user.
 * @param {integer} userID - User ID.
 * @returns {object} data - The response object containing a list of properties with high priority.
 */
exports.getPropBySeller = async function getPropBySeller(userID) {
    const query = 'SELECT * FROM properties WHERE sellerID = ?';
    const data = await db.run_query(query, userID);
    return data;
};

/**
 * SQL Query function delete a property by it's ID from DB.
 * @param {integer} id - Property ID.
 * @returns {object} data - The response object.
 */
exports.deletePropertyById = async function deletePropertyById(id) {
    const query = 'DELETE FROM properties WHERE prop_ID = ?';
    const data = await db.run_query(query, id);
    return data;
};

/**
 * SQL Query function to toggle the highPriority attribute of a property by it's ID.
 * @param {integer} id - Property ID.
 * @returns {object} data - The response object.
 */
exports.toggleHighPriority = async function toggleHighPriority(id) {
    const query = 'UPDATE properties SET highPriority = !highPriority WHERE prop_ID = ?';
    const data = await db.run_query(query, id);
    return data;
};

/**
 * SQL Query function to add an new property.
 * @param {object} property - User Object.
 * @returns {object} data - The response object.
 */
exports.addProperty = async function addProperty(property) {
    const query = 'INSERT INTO properties SET ?';
    const data = await db.run_query(query, property);
    return data;
};

/**
 * SQL Query function to update the property status.
 * @param {integer} id - Property ID.
 * @param {string} status - Property Status
 * @returns {object} data - The response object.
 */
exports.updateStatus = async function updateStatus(status, id) {
    const query = 'UPDATE properties SET status = ? WHERE prop_ID = ?';
    const values = [status, id];
    const data = await db.run_query(query, values);
    return data;
};

/**
 * SQL Query function to update the property attributes.
 * @param {object} property - Property object.
 * @param {integer} id - Property ID.
 * @returns {object} data - The response object.
 */
exports.updateProperty = async function updateProperty(property, id) {
    const query = 'UPDATE properties SET ? WHERE prop_ID = ?';
    const values = [property, id];
    const data = await db.run_query(query, values);
    return data;
};

/**
 * SQL Query function to add the property images name to the propertiesImages table.
 * @param {string} path - Property Image name.
 * @param {integer} prop_ID - Property ID
 * @returns {object} data - The response object.
 */
exports.AddPropertyImage = async function AddPropertyImage(path, prop_ID) {
    const query = 'INSERT INTO propertiesImages SET imageName = ?, prop_ID = ?';
    const values = [path, prop_ID];
    const data = await db.run_query(query, values);
    return data;
};
