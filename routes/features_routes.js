/**
* A module to handle the features routes.
* @module routes/features_routes
* @author Gheorghe Craciun
*/

const Router = require('koa-router');

const bodyParser = require('koa-bodyparser');

// Connect with model for DB
const model = require('../models/features_model');

// Import auth part
//const auth = require('../controllers/auth');

// Deal with Permissions
//const permissions = require('../permissions/features_permissions');

// Validation Schemas
//const { validateCategoryAdd } = require('../controllers/validation');

// Since we are handling users use a URI that begin's with an appropriate path
const router = Router({ prefix: '/api/features' });

/**
 * Function that gets the list of all features.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function getAllFeatures(cnx) {
    const result = await model.getAllFeatures();
    if (result.length) {
        cnx.status = 200;
        cnx.body = result;
    } else {
        cnx.status = 404;
    }
}

/**
 * Function that gets the list of features for a given property.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function getAllFeaturesForProperty(cnx) {
    const propID = cnx.params.id;

    const result = await model.getFeaturesForProperty(propID);
    if (result.length) {
        cnx.status = 200;
        cnx.body = result;
    } else {
        cnx.status = 404;
    }
}

// Gets
router.get('/', getAllFeatures);
router.get('/:id([0-9]{1,})', getAllFeaturesForProperty);

// Delete
//router.del('/:id([0-9]{1,})', auth, deleteById);

// Post
//router.post('/', auth, bodyParser(), validateCategoryAdd, addCategories);

// Export object.
module.exports = router;
