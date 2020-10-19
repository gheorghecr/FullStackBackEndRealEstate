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

// Connect with model for DB
const model_users = require('../models/users_model');

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
 * Funtion that gets the list of all properties, that are visible to the admin.
 * @param {object} cnx - The request object.
 * @returns {function} - List of all properties.
 */
async function getAllPropAdminView(cnx) {
  const permission = permissions.readAllAdmin(cnx.state.user);
  if (!permission.granted) {
    //permission not granted
    cnx.status = 401;
  } else {
    //permission granted
    const result = await model.getAllAdminView();
    if (result.length) {
      cnx.status = 200;
      cnx.body = result;
    } else {
      cnx.status = 404;
    }
  }
}

/**
 * Funtion that gets the list of all properties, that are visible to the public.
 * Includes the ones where the visibility is set to false.
 * @param {object} cnx - The request object.
 * @returns {function} - List of all properties.
 */
async function getAllProp(cnx) {
  const result = await model.getAll();
  if (result.length) {
    cnx.status = 200;
    cnx.body = result;
  } else {
    cnx.status = 404;
  }
}

/**
 * Funtion that gets the an property detail by it's ID.
 * @param {object} cnx - The request object.
 * @returns {function} - Property details.
 */
async function getAllPropById(cnx) {
  const id = cnx.params.id;
  const result = await model.getPropByID(id);
  if (result.length) {
    cnx.status = 200;
    cnx.body = result;
  } else {
    cnx.status = 404;
  }
}

/**
 * Funtion that gets all properties with high priority.
 * @param {object} cnx - The request object.
 * @returns {function} - List of properties with high priority.
 */
async function getAllPropHighPriority(cnx) {
  const result = await model.getPropHighPriority();
  if (result.length) {
    cnx.status = 200;
    cnx.body = result;
  } else {
    cnx.status = 404;
  }
}





router.get('/', getAllProp);
router.get('/adminview', auth, getAllPropAdminView);
router.get('/highpriority', getAllPropHighPriority);
// router.post('/', bodyParser(), validateUser, createAccount);
router.get('/:id([0-9]{1,})', getAllPropById);
// router.put('/:id([0-9]{1,})', auth, bodyParser(), validateUserUpdate, updateUserInfo);
// router.del('/:id([0-9]{1,})', auth, deleteUserById);

// Export object.
module.exports = router;
