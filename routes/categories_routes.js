/**
* A module to handle the categories routes.
* @module routes/categories_routes
* @author Gheorghe Craciun
*/

const Router = require('koa-router');

const bodyParser = require('koa-bodyparser');

// Connect with model for DB
const model = require('../models/categories_model');

// Import auth part
const auth = require('../controllers/auth');

// Deal with Permissions
const permissions = require('../permissions/categories_permissions');

// Validation Schemas
const { validateCategoryAdd } = require('../controllers/validation');

// Since we are handling users use a URI that begin's with an appropriate path
const router = Router({ prefix: '/api/categories' });

/**
 * Function that gets the list of all categories.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function getAllCategories(cnx) {
    const result = await model.getAllCategories();
    if (result.length) {
        cnx.status = 200;
        cnx.body = result;
    } else {
        cnx.status = 404;
    }
}

/**
 * Function that gets the list of categories for a given property.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function getAllCategoriesForProperty(cnx) {
    const propID = cnx.params.id;

    const result = await model.getCategoriesForProperty(propID);
    if (result.length) {
        cnx.status = 200;
        cnx.body = result;
    } else {
        cnx.status = 404;
    }
}

/**
 * Function that deletes a category by it's ID.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function addCategories(cnx) {
    // check permission if user can add a category
    const permission = permissions.addCategory(cnx.state.user);

    const { body } = cnx.request;

    if (!permission.granted) {
        // if permission is not granted
        cnx.status = 403;
    } else {
        const result = await model.addCategory(body);
        if (result) {
            // category addedd
            cnx.status = 201;
            cnx.body = { id: result.insertId, created: true, link: `${cnx.request.path}/${result.insertId}` };
        } else {
            // category not addedd
            cnx.status = 501;
        }
    }
}

/**
 * Function that deletes a category by it's ID.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function deleteById(cnx) {
    const categoryID = cnx.params.id;

    // check permission if user can delete a category
    const permission = permissions.deleteCategory(cnx.state.user);

    if (!permission.granted) {
        // if permission is not granted
        cnx.status = 403;
    } else {
        const result = await model.deleteCategoryById(categoryID);
        if (result.affectedRows > 0) {
            cnx.status = 200;
            cnx.body = { ID: categoryID, deleted: true };
        } else {
            cnx.status = 501;
            cnx.body = { ID: categoryID, deleted: false };
        }
    }
}

// Gets
router.get('/', getAllCategories);
router.get('/:id([0-9]{1,})', getAllCategoriesForProperty);

// Delete
router.del('/:id([0-9]{1,})', auth, deleteById);

// Post
router.post('/', auth, bodyParser(), validateCategoryAdd, addCategories);

// Export object.
module.exports = router;
