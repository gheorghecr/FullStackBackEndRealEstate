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
const { validatePropertyAdd } = require('../controllers/validation');

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


/**
 * Funtion allows an ADMIN to delete an property.
 * And then lets the ADMIN know if update was sucessful or not.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function deletePropById(cnx) {
  /// Get the property ID from the route parameters.
  const propID = cnx.params.id;

  // get the property first, (check if exisits)
  const property = await model.getPropByID(propID);

  // if property is found in the database continue
  // otherwise send message back saying user not found
  if (property.length) {
    // check permission if user can delete info
    const permission = permissions.deleteProp(cnx.state.user, property[0]);
    if (!permission.granted) {
      // if permission is not granted
      cnx.status = 403;
    } else {
      // perform delete on database
      const result = await model.deletePropertyById(propID);
      if (result.affectedRows > 0) {
        cnx.status = 200;
        cnx.body = { ID: propID, deleted: true };
      } else {
        cnx.status = 400;
        cnx.body = { ID: propID, deleted: false };
      }
    }
  } else {
    cnx.status = 404;
  }
}

/**
 * Funtion that toggles the high priority attribute of a property by it's ID.
 * @param {object} cnx - The request object.
 * @returns {function} - List of properties with high priority.
 */
async function toggleHighPriority(cnx) {
  /// Get the property ID from the route parameters.
  const propID = cnx.params.id;

  // get the property first, (check if exisits)
  const property = await model.getPropByID(propID);

  // if property is found in the database continue
  // otherwise send message back saying user not found
  if (property.length) {
    // check permission if user can delete info
    const permission = permissions.toggleHighPriority(cnx.state.user, property[0]);
    if (!permission.granted) {
      // if permission is not granted
      cnx.status = 403;
    } else {
      // perform update on database
      const result = await model.toggleHighPriority(propID);
      if (result.affectedRows > 0) {
        cnx.status = 200;
        cnx.body = { ID: propID, updated: true, link: `${cnx.request.path}` };
      } else {
        cnx.status = 400;
        cnx.body = { ID: propID, updated: false };
      }
    }
  } else {
    cnx.status = 404;
  }
}


/**
 * Function allows an user to add a new property.
 * And return and the propertyID if property was sucessfully created.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function addProperty(cnx) {
  const body = cnx.request.body;

  // check permission if user can add new property
  const permission = permissions.addProperty(cnx.state.user);
  if (!permission.granted) {
    // if permission is not granted
    cnx.status = 403;
  } else {
    // perform query on database
    const result = await model.addProperty(body);
    if (result) {
      //property addedd
      cnx.status = 201;
      cnx.body = { id: result.insertId, created: true, link: `${cnx.request.path}/${result.insertId}` };
    } else {
      //property not addedd
      cnx.status = 501;
    }
  }
}




router.get('/', getAllProp);
router.get('/adminview', auth, getAllPropAdminView);
router.get('/highpriority', getAllPropHighPriority);
router.get('/togglehighpriority/:id([0-9]{1,})', auth, toggleHighPriority);
router.post('/', bodyParser(), auth, validatePropertyAdd, addProperty); 
router.get('/:id([0-9]{1,})', getAllPropById);
// router.put('/:id([0-9]{1,})', auth, bodyParser(), validateUserUpdate, updateUserInfo);
router.del('/:id([0-9]{1,})', auth, deletePropById); 

// Export object.
module.exports = router;
