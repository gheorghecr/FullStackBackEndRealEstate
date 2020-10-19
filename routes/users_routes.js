/**
* A module to handle the user routes.
* @module routes/user_routes
* @author Gheorghe Craciun
*/

const Router = require('koa-router');

const bodyParser = require('koa-bodyparser');

// Password encryption
const bcrypt = require('bcrypt');

// Connect with model for DB
const model = require('../models/users_model');

// Import auth part
const auth = require('../controllers/auth');

// Validation Schemas
const { validateUser, validateUserUpdate } = require('../controllers/validation');

// Deal with Permissions
const permissions = require('../permissions/users_permissions');

// Since we are handling users use a URI that begings with an appropriate path
const router = Router({ prefix: '/api/users' });

// Handle functions
/**
 * Funtion that gets the the list of all users Personal Info, from the DB and returns it,
 * if the user is an ADMIN.
 * @param {object} cnx - The request object.
 * @returns {function} - List of all users with it's personal data.
 */
async function getAll(cnx) {
  const permission = permissions.readAll(cnx.state.user);
  if (!permission.granted) {
    cnx.status = 401;
  } else {
    const result = await model.getAll();
    if (result.length) {
      cnx.status = 200;
      cnx.body = result;
    }
  }
}

/**
 * Funtion that gets and returns an user (by it's ID) personal Info.
 * Each user can only acess it's own data.
 * If the user is an ADMIN  has acess to all users data. Filters data
 * so it does not show sentive data such as password.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function getById(cnx) {
  const id = cnx.params.id;

  // get user from DB (check if exists)
  const user = await model.getUserInfoById(id);

  // if user is found in the database continue
  // otherwise send message back saying user not found
  if (user.length) {
    // check permissions
    const permission = permissions.read(cnx.state.user, user[0]);

    // filter data which user cannot see
    user[0] = permission.filter(user[0]);
    if (!permission.granted) {
      cnx.status = 401;
    } else {
      if (user.length) {
        cnx.status = 200;
        cnx.body = user[0];
      } else {
        cnx.status = 404;
      }
    }
  }
}

/**
 * Funtion allows an user to register on the application.
 * And return and the userID if account was sucessfully created.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function createAccount(cnx) {
  const body = cnx.request.body;

  // encrypt password
  const hash = bcrypt.hashSync(body.password, 10);
  body.password = hash;
  // perform query on database
  const result = await model.register(body);
  if (result) {
    cnx.status = 201;
    cnx.body = { id: result.insertId, created: true, link: `${cnx.request.path}/${result.insertId}` };
  } else {
    cnx.status = 501;
  }
}

/**
 * Funtion allows an user to update it's own personal data.
 * And then lets the user know if update was sucessful or not.
 * Admin can update any user data.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function updateUserInfo(cnx) {
  const id = cnx.params.id;
  const body = cnx.request.body;

  // get the user first, (check if exisits)
  const user = await model.getUserInfoById(id);

  // if user is found in the database continue
  // otherwise send message back saying user not found
  if (user.length) {
    // check permission if user can update info
    const permission = permissions.update(cnx.state.user, user[0]);

    if (!permission.granted) {
      // if permission is not granted
      cnx.status = 403;
    } else {
      // if user is updating password, encryp it
      if (body.password) {
        body.password = bcrypt.hashSync(body.password, 10);
      }
      // perform update on database
      const result = await model.updateById(id, body);
      if (result.affectedRows > 0) {
        cnx.status = 200;
        cnx.body = { id: id, updated: true, link: `${cnx.request.path}/${id}` };
      } else {
        cnx.status = 400;
      }
    }
  } else {
    cnx.status = 404;
  }
}

/**
 * Funtion allows an ADMIN to delete an account.
 * And then lets the ADMIN know if update was sucessful or not.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function deleteUserById(cnx) {
  /// Get the ID from the route parameters.
  const id = cnx.params.id;

  // get the user first, (check if exisits)
  const user = await model.getUserInfoById(id);

  // if user is found in the database continue
  // otherwise send message back saying user not found
  if (user.length) {
    // check permission if user can delete info
    const permission = permissions.delete(cnx.state.user, user[0]);

    if (!permission.granted) {
      // if permission is not granted
      cnx.status = 403;
    } else {
      // perform delete on database
      const result = await model.deleteAccountById(id);
      if (result.affectedRows > 0) {
        cnx.status = 200;
        cnx.body = { ID: id, deleted: true };
      } else {
        cnx.status = 400;
        cnx.body = { ID: id, deleted: false };
      }
    }
  } else {
    cnx.status = 404;
  }
}

router.get('/', auth, getAll);
router.post('/', bodyParser(), validateUser, createAccount);
router.get('/:id([0-9]{1,})', auth, getById);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateUserUpdate, updateUserInfo);
router.del('/:id([0-9]{1,})', auth, deleteUserById);

// Export object.
module.exports = router;
