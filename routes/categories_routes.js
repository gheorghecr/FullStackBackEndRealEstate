/**
* A module to handle the categories routes.
* @module routes/categories_routes
* @author Gheorghe Craciun
*/

const Router = require('koa-router');

const bodyParser = require('koa-bodyparser');

// Connect with model for DB
const model = require('../models/categories_model');

// Since we are handling users use a URI that begin's with an appropriate path
const router = Router({ prefix: '/api/categories' });

/**
 * Function that gets the list of all categories.
 * @param {object} cnx - The request object.
 * @returns {function} - List of all categories.
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
 * @returns {function} - List of all categories.
 */
async function getAllCategories(cnx) {
    const propID = cnx.params.id;
    
    const result = await model.getCategoriesForProperty(propID);
    if (result.length) {
        cnx.status = 200;
        cnx.body = result;
    } else {
        cnx.status = 404;
    }
}

router.get('/', getAllCategories);
router.get('/:id([0-9]{1,})', getAllCategories);

// Export object.
module.exports = router;
