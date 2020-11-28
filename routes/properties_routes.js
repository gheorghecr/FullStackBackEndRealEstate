/* eslint-disable object-shorthand */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */
/**
* A module to handle the properties routes.
* @module routes/properties_routes
* @author Gheorghe Craciun
*/

const Router = require('koa-router');

const bodyParser = require('koa-bodyparser');

// Used to get an file
const multer = require('koa-multer');

// Connect with model for DB
const model = require('../models/properties_model');

// Import auth part
const auth = require('../controllers/auth');

// Validation Schemas
const { validatePropertyAdd, validatePropertyUpdate } = require('../controllers/validation');

// Deal with Permissions
const permissions = require('../permissions/properties_permissions');

// Since we are handling users use a URI that begins with an appropriate path
const router = Router({ prefix: '/api/properties' });

// Used in order to get the images from the property
const storage = multer.diskStorage({
    destination(_req, _file, cb) {
        cb(null, './public/');
    },
    filename(_req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});

const upload = multer({ storage: storage });

// Handle functions
/**
 * Function that gets the list of all properties, that are visible to the admin.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - List of all properties.
 */
async function getAllPropAdminView(cnx) {
    const adminID = cnx.state.user.userID;
    const permission = permissions.readAllAdmin(cnx.state.user);
    if (!permission.granted) {
    // permission not granted
        cnx.status = 401;
    } else {
    // permission granted
        const result = await model.getAllAdminView(adminID);
        if (result.length) {
            cnx.status = 200;
            cnx.body = result;
        } else {
            cnx.status = 404;
            cnx.body = { message: 'No properties available' };
        }
    }
}

/**
 * Function that gets the list of all properties, that are visible to the admin
 * and are marked as high Priority.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - List of all properties.
 */
async function getAllPropAdminViewHighPriority(cnx) {
    const adminID = cnx.state.user.userID;
    const permission = permissions.readAllAdmin(cnx.state.user);
    if (!permission.granted) {
    // permission not granted
        cnx.status = 401;
    } else {
    // permission granted
        const result = await model.getAllAdminViewHighPriority(adminID);
        if (result.length) {
            cnx.status = 200;
            cnx.body = result;
        } else {
            cnx.status = 404;
            cnx.body = { message: 'No properties available marked as High Priority' };
        }
    }
}

/**
 * Function that gets the list of all properties, that are visible to the public.
 * Includes the ones where the visibility is set to false.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - List of all properties.
 */
async function getAllProp(cnx) {
    const result = await model.getAll();
    if (result.length) {
        cnx.status = 200;
        cnx.body = result;
    } else {
        cnx.status = 404;
        cnx.body = { message: 'No properties available' };
    }
}

/**
 * Function that gets the an property detail by it's ID.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - Property details.
 */
async function getAllPropById(cnx) {
    const { id } = cnx.params;
    const result = await model.getPropByID(id);
    if (result.length) {
        cnx.status = 200;
        cnx.body = result;
    } else {
        cnx.status = 404;
    }
}

/**
 * Function that gets all properties that are listed by an user.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - List of properties with high priority.
 */
async function getAllPropByUserID(cnx) {
    const { id } = cnx.params;
    const result = await model.getPropBySeller(id);
    if (result.length) {
        cnx.status = 200;
        cnx.body = result;
    } else {
        cnx.status = 404;
    }
}

/**
 * Function that gets all properties with high priority.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - List of properties with high priority.
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
 * Function allows an ADMIN to delete an property.
 * And then lets the ADMIN know if update was successful or not.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function deletePropById(cnx) {
    /// Get the property ID from the route parameters.
    const propID = cnx.params.id;

    // get the property first, (check if exists)
    const property = await model.getPropByID(propID);

    // if property is found in the database continue
    // otherwise send message back saying user not found
    if (property.length) {
    // check permission if user can delete info
        const permission = permissions.deleteProp(cnx.state.user);
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
 * Function that toggles the high priority attribute of a property by it's ID.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function toggleHighPriority(cnx) {
    /// Get the property ID from the route parameters.
    const propID = cnx.params.id;

    // get the property first, (check if exists)
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
                cnx.status = 501;
                cnx.body = { ID: propID, updated: false };
            }
        }
    } else {
        cnx.status = 404;
    }
}

/**
 * Function that toggles the visibility attribute of a property by it's ID.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function toggleVisibility(cnx) {
    /// Get the property ID from the route parameters.
    const propID = cnx.params.id;

    // get the property first, (check if exists)
    const property = await model.getPropByID(propID);

    // if property is found in the database continue
    // otherwise send message back saying user not found
    if (property.length) {
    // check permission if user can delete info
        const permission = permissions.update(cnx.state.user, property[0]);
        if (!permission.granted) {
            // if permission is not granted
            cnx.status = 403;
        } else {
            // perform update on database
            const result = await model.toggleVisibility(propID);
            if (result.affectedRows > 0) {
                cnx.status = 200;
                cnx.body = { ID: propID, updated: true, link: `${cnx.request.path}` };
            } else {
                cnx.status = 501;
                cnx.body = { ID: propID, updated: false };
            }
        }
    } else {
        cnx.status = 404;
    }
}

/**
 * Function allows an admin to add a new property.
 * And return and the propertyID if property was successfully created.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function addProperty(cnx) {
    const body = cnx.req.body;
    const currentUserID = cnx.state.user.userID;

    // check permission if user can add new property
    const permission = permissions.addProperty(cnx.state.user);
    if (!permission.granted) {
    // if permission is not granted
        cnx.status = 403;
    } else {
    // perform query on database
        body.sellerID = currentUserID;
        const result = await model.addProperty(body);
        if (result) {
            // property addedd
            cnx.status = 201;
            cnx.body = { id: result.insertId, created: true, link: `${cnx.request.path}/${result.insertId}` };

            // Add images name to the propertiesImages table
            for (const fileObject of cnx.req.files) {
                await model.AddPropertyImage(fileObject.filename, result.insertId);
            }
        } else {
            // property not addedd
            cnx.status = 501;
        }
    }
}

/**
 * Function allows an admin to update the status. (For sale, Under Offer, Sold)
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function updateStatusByID(cnx) {
    /// Get the property ID from the route parameters.
    const propID = cnx.params.id;

    const { body } = cnx.request;

    // get the property first, (check if exists)
    const property = await model.getPropByID(propID);

    // if property is found in the database continue
    // otherwise send message back saying user not found
    if (property.length) {
    // check permission if user can delete info
        const permission = permissions.update(cnx.state.user);
        if (!permission.granted) {
            // if permission is not granted
            cnx.status = 403;
        } else {
            // perform update on database
            const result = await model.update(body.status, propID);
            if (result.affectedRows > 0) {
                cnx.status = 200;
                cnx.body = { ID: propID, updated: true, link: `/api/properties/${propID}` };
            } else {
                cnx.status = 501;
                cnx.body = { ID: propID, updated: false };
            }
        }
    } else {
        cnx.status = 404;
    }
}

/**
 * Function allows an admin to update an property attributes.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function updatePropertyByID(cnx) {
    /// Get the property ID from the route parameters.
    const propID = cnx.params.id;

    const body = cnx.req.body;

    // get the property first, (check if exists)
    const property = await model.getPropByID(propID);

    // if property is found in the database continue
    // otherwise send message back saying user not found
    if (property.length) {
    // check permission if user can delete info
        const permission = permissions.update(cnx.state.user);
        if (!permission.granted) {
            // if permission is not granted
            cnx.status = 403;
        } else {
            // perform update on database
            const result = await model.updateProperty(body, propID);
            if (result.affectedRows > 0) {
                cnx.status = 200;
                cnx.body = { ID: propID, updated: true, link: `/api/properties/${propID}` };

                // Add images name to the propertiesImages table
                for (const fileObject of cnx.req.files) {
                    await model.AddPropertyImage(fileObject.filename, propID);
                }
            } else {
                cnx.status = 501;
                cnx.body = { ID: propID, updated: false };
            }
        }
    } else {
        cnx.status = 404;
    }
}

// Gets
router.get('/', getAllProp);
router.get('/adminview', auth, getAllPropAdminView);
router.get('/adminview/highPriority', auth, getAllPropAdminViewHighPriority);
router.get('/highpriority', getAllPropHighPriority);
router.get('/togglehighpriority/:id([0-9]{1,})', auth, toggleHighPriority);
router.get('/togglevisibility/:id([0-9]{1,})', auth, toggleVisibility);
router.get('/:id([0-9]{1,})', getAllPropById);
router.get('/seller/:id([0-9]{1,})', getAllPropByUserID);

// Post's
router.post('/', auth, validatePropertyAdd, upload.array('file', 20), bodyParser(), addProperty);

// Put's
router.put('/status/:id([0-9]{1,})', bodyParser(), auth, updateStatusByID);
router.put('/:id([0-9]{1,})', auth, validatePropertyUpdate, upload.array('file', 20), bodyParser(), updatePropertyByID);

// Del's
router.del('/:id([0-9]{1,})', auth, deletePropById);

// Export object.
module.exports = router;
