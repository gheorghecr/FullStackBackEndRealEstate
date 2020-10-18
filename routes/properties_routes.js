/**
* A module to handle the properties routes.
* @module routes/properties_routes
* @author Gheorghe Craciun
*/

const Router = require('koa-router');

const bodyParser = require('koa-bodyparser');

// Password encryption
const bcrypt = require('bcrypt');

// Connect with model for DB
const model = require('../models/properties_model');

// Import auth part
const auth = require('../controllers/auth');

// Validation Schemas
const { validateUser, validateUserUpdate } = require('../controllers/validation');

// Deal with Permissions
const permissions = require('../permissions/properties_permissions');

// Since we are handling users use a URI that begings with an appropriate path
const router = Router({ prefix: '/api/properties' });

// Handle functions
/**
 * Funtion that gets the the list of all properties, from the DB and returns it.
 * @param {object} cnx - The request object.
 * @returns {function} - List of all properties.
 */
async function getAllProp(cnx) {
  const result = await model.getAll();
    if (result.length) {
      cnx.status = 200;
      cnx.body = result;
    }
}




router.get('/', getAllProp);
// router.post('/', bodyParser(), validateUser, createAccount);
// router.get('/:id([0-9]{1,})', auth, getById);
// router.put('/:id([0-9]{1,})', auth, bodyParser(), validateUserUpdate, updateUserInfo);
// router.del('/:id([0-9]{1,})', auth, deleteUserById);

// Export object.
module.exports = router;
