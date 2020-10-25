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
const auth = require('../controllers/auth');

// Deal with Permissions
const permissions = require('../permissions/features_permissions');

// Validation Schemas
const { validateFeatureAdd, validateFeatureUpdate } = require('../controllers/validation');

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

/**
 * Function that adds a feature by it's ID.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function addFeatures(cnx) {
    // check permission if user can add a feature
    const permission = permissions.addFeature(cnx.state.user);

    const { body } = cnx.request;

    if (!permission.granted) {
        // if permission is not granted
        cnx.status = 403;
    } else {
        const result = await model.addFeatures(body);
        if (result) {
            // feature addedd
            cnx.status = 201;
            cnx.body = { id: result.insertId, created: true, link: `${cnx.request.path}/${result.insertId}` };
        } else {
            // feature not addedd
            cnx.status = 501;
        }
    }
}

/**
 * Function that updates a feature by it's ID.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function updateById(cnx) {
    const featureID = cnx.params.id;

    // check permission if user can update a feature
    const permission = permissions.updateFeature(cnx.state.user);

    const { body } = cnx.request;

    if (!permission.granted) {
        // if permission is not granted
        cnx.status = 403;
    } else {
        const result = await model.updateFeature(featureID, body);
        if (result.affectedRows > 0) {
            cnx.status = 200;
            cnx.body = { ID: featureID, updated: true, link: `${cnx.request.path}/${featureID}` };
        } else {
            cnx.status = 501;
            cnx.body = { ID: featureID, updated: false };
        }
    }
}

/**
 * Function that deletes a feature by it's ID.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function deleteById(cnx) {
    const featureID = cnx.params.id;

    // check permission if user can delete a feature
    const permission = permissions.deleteFeature(cnx.state.user);

    if (!permission.granted) {
        // if permission is not granted
        cnx.status = 403;
    } else {
        const result = await model.deleteFeatureById(featureID);
        if (result.affectedRows > 0) {
            cnx.status = 200;
            cnx.body = { ID: featureID, deleted: true };
        } else {
            cnx.status = 501;
            cnx.body = { ID: featureID, deleted: false };
        }
    }
}

// Gets
router.get('/', getAllFeatures);
router.get('/:id([0-9]{1,})', getAllFeaturesForProperty);

// Delete
router.del('/:id([0-9]{1,})', auth, deleteById);

// Post
router.post('/', auth, bodyParser(), validateFeatureAdd, addFeatures);

// Put
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateFeatureUpdate, updateById);

// Export object.
module.exports = router;
