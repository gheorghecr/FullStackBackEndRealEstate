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

/**
 * SQL Query function to get the categories for a given property.
 * @param {integer} propID - category ID.
 * @returns {object} data - The response object containing all categories for a given property.
 */
exports.getCategoriesForProperty = async function getCategoriesForProperty(id) {
    let query = "SELECT c.ID, c.name FROM propertyCategories as pc INNER JOIN categories AS c";
    query += " ON pc.categoryID = c.ID WHERE pc.propertyID = ?;";
    const result = await db.run_query(query, id);
    return result;
}

/**
 * SQL Query function to delete a category by it's ID.
 * @param {integer} propID - category ID.
 * @returns {object} data - The response object.
 */
exports.deleteCategoryById = async function deleteCategoryById (id) {
    const query = "DELETE FROM categories WHERE ID = ?;";
    const data = await db.run_query(query, id);
    return data;
}

/**
 * SQL Query function to add a category.
 * @param {object} category - The category object.
 * @returns {object} data - The response object.
 */
exports.addCategory = async function addCategory (category) {
    const query = "INSERT INTO categories SET ?;";
    const data = await db.run_query(query, category);
    return data;
}
