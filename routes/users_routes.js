/**
* A module to handle the user routes.
* @module routes/user_routes
* @author Gheorghe Craciun
*/

const Router = require('koa-router');

const bodyParser = require('koa-bodyparser');

// Password encryption
const bcrypt = require('bcrypt');

// Used to get an file
const multer = require('koa-multer');

// Used to store the image
const fs = require('fs-extra');

// Connect with model for DB
const model = require('../models/users_model');

// Import auth part
const auth = require('../controllers/auth');

// Validation Schemas
const { validateUser, validateUserUpdate } = require('../controllers/validation');

// Deal with Permissions
const permissions = require('../permissions/users_permissions');

const prefix = '/api/users';
// eslint-disable-next-line object-shorthand
const router = Router({ prefix: prefix });

// Used in order to get the images from the user
const upload = multer({
    storage: multer.memoryStorage(),
});

// Handle functions

// TODO: Add open documentation.
async function login(cnx) {
    if (typeof cnx.state.user !== 'object') {
      // it means that the user was not authenticated and 
      // ctx.state.user has an error message
      // send back error message and code
      cnx.status = 401;
      cnx.body = { errorMessage: cnx.state.user }
    } else {
      const {
          userID, username, email, firstName, lastName,
      } = cnx.state.user;
      const links = {
          self: `${cnx.protocol}://${cnx.host}${prefix}/${userID}`,
      };
      cnx.body = {
          userID, username, email, firstName, lastName, links,
      };
    }
}

/**
 * Function that gets the the list of all users Personal Info, from the DB and returns it,
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
 * Function that gets and returns an user (by it's ID) personal Info.
 * Each user can only access it's own data.
 * If the user is an ADMIN  has access to all users data. Filters data
 * so it does not show sensitive data such as password.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function getById(cnx) {
    const { id } = cnx.params;

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
        } else if (user.length) {
            cnx.status = 200;
            cnx.body = user[0];
        } else {
            cnx.status = 404;
        }
    } else {
        // user not found
        cnx.status = 404;
    }
}

/**
 * Function allows an user to register on the application.
 * And return and the userID if account was successfully created.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function createAccount(cnx) {
    const { body } = cnx.request;
    // encrypt password
    const hash = bcrypt.hashSync(body.password, 10);
    body.password = hash;

    // Check if it's an admin registering
    if (body.sign_up_code === 'we_sell_houses_agent') {
        body.role = 'admin';
    }
    // delete this from object as is not needed to store
    delete body.sign_up_code;

    let result;
    try {
        // perform query on database
        result = await model.register(body);
        if (result) {
            cnx.status = 201;
            cnx.body = { id: result.insertId, created: true, link: `${cnx.request.path}/${result.insertId}` };
        }
    } catch (error) {
        cnx.status = 501;
        cnx.body = { errorMessage: error.errorDescription };
    }
}

/**
 * Function allows an user to update it's own personal data.
 * And then lets the user know if update was successful or not.
 * Admin can update any user data.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function updateUserInfo(cnx) {
    const { id } = cnx.params;
    const { body } = cnx.request;

    // get the user first, (check if exists)
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
            // if user is updating password, encrypt it
            if (body.password) {
                body.password = bcrypt.hashSync(body.password, 10);
            }
            // perform update on database
            const result = await model.updateById(id, body);
            if (result.affectedRows > 0) {
                cnx.status = 200;
                cnx.body = { id, updated: true, link: `${cnx.request.path}/${id}` };
            } else {
                cnx.status = 501;
            }
        }
    } else {
        cnx.status = 404;
    }
}

/**
 * Function allows an ADMIN to delete an account.
 * And then lets the ADMIN know if update was successful or not.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function deleteUserById(cnx) {
    /// Get the ID from the route parameters.
    const { id } = cnx.params;

    // get the user first, (check if exists)
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
                cnx.status = 501;
                cnx.body = { ID: id, deleted: false };
            }
        }
    } else {
        cnx.status = 404;
    }
}

router.get('/', auth, getAll);
router.post('/login', auth, login);
router.post('/', upload.array('fileList'), bodyParser(), /* validateUser, */ createAccount);
router.get('/:id([0-9]{1,})', auth, getById);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateUserUpdate, updateUserInfo);
router.del('/:id([0-9]{1,})', auth, deleteUserById);

// Export object.
module.exports = router;
