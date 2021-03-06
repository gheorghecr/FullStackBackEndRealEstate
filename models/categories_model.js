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
};

/**
 * SQL Query function to get the categories for a given property.
 * @param {integer} id - property ID.
 * @returns {object} data - The response object containing all categories for a given property.
 */
exports.getCategoriesForProperty = async function getCategoriesForProperty(id) {
    let query = 'SELECT pc.propertyCategoryID, c.ID, c.name FROM propertyCategories as pc INNER JOIN categories AS c';
    query += ' ON pc.categoryID = c.ID WHERE pc.propertyID = ?;';
    const result = await db.run_query(query, id);
    return result;
};

/**
 * SQL Query function to delete a category by it's ID.
 * @param {integer} id - category ID.
 * @returns {object} data - The response object.
 */
exports.deleteCategoryById = async function deleteCategoryById(id) {
    const query = 'DELETE FROM categories WHERE ID = ?;';
    const data = await db.run_query(query, id);
    return data;
};

/**
 * SQL Query function to add a category.
 * @param {object} category - The category object.
 * @returns {object} data - The response object.
 */
exports.addCategory = async function addCategory(category) {
    const query = 'INSERT INTO categories SET ?;';
    const data = await db.run_query(query, category);
    return data;
};

/**
 * SQL Query function to update the categories by it's ID.
 * @param {integer} id - categoryID.
 * @param {integer} category - feature Object.
 * @returns {object} data - The response object.
 */
exports.updateCategory = async function updateCategory(id, category) {
    const query = 'UPDATE categories SET ? WHERE ID = ?';
    const values = [category, id];
    const data = await db.run_query(query, values);
    return data;
};

/**
 * SQL Query function to add the category to a property by property ID and category ID.
 * @param {integer} propertyID - property ID.
 * @param {integer} categoryID - feature ID .
 * @returns {object} data - The response object.
 */
exports.addCategoryForProperty = async function addCategoryForProperty(propertyID, categoryID) {
    const dataToInsert = { propertyID, categoryID };
    const query = 'INSERT INTO propertyCategories SET ?';
    const values = [dataToInsert];
    const data = await db.run_query(query, values);
    return data;
};

/**
 * SQL Query function to delete a property category by propertyCategoryID.
 * @param {integer} propertyCategoryID - propertyCategoryID.
 * @returns {object} data - The response object.
 */
exports.deletePropertyCategory = async function deletePropertyCategory(propertyCategoryID) {
    const query = 'DELETE FROM propertyCategories WHERE propertyCategoryID = ?;';
    const data = await db.run_query(query, propertyCategoryID);
    return data;
};
