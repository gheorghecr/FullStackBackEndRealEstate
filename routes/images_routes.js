/* eslint-disable no-restricted-syntax */
/**
* A module to handle the images routes.
* @module routes/images_routes
* @author Gheorghe Craciun
*/

// Used to store the image
const fs = require('fs-extra');

const Router = require('koa-router');

// Connect with model for DB
const model = require('../models/images_model');

// Import auth part
const auth = require('../controllers/auth');

// Deal with Permissions
const permissions = require('../permissions/images_permissions');

// Since we are handling users use a URI that begin's with an appropriate path
const router = Router({ prefix: '/api/images' });

/**
 * Function that gets an the images names for an property.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function getAllImagesForProperty(cnx) {
    const propID = cnx.params.id;

    const result = await model.getAllImagesNamesForProperty(propID);
    if (result.length) {
        cnx.status = 200;
        cnx.body = result;
    } else {
        cnx.status = 404;
        cnx.body = { message: 'Nothing was found' };
    }
}

/**
 * Function that deletes a image by it's ID.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function deleteImageById(cnx) {
    const imageID = cnx.params.id;

    const imageName = await model.getImageNameByImageID(imageID);

    // if image is found in the database continue
    // otherwise send error message back saying message not found
    if (imageName.length) {
        // check permission if user can delete message
        const permission = permissions.deleteImage(cnx.state.user);
        if (!permission.granted) {
            // if permission is not granted
            cnx.status = 403;
        } else {
            // perform delete on database
            const result = await model.deleteImageById(imageID);
            if (result.affectedRows > 0) {
                // Delete the correct image from the public folder
                fs.unlink(`./public/${imageName[0].imageName}`);
                cnx.status = 200;
                cnx.body = { ID: imageID, deleted: true };
            } else {
                cnx.status = 501;
                cnx.body = { ID: imageID, deleted: false };
            }
        }
    } else {
        cnx.status = 404;
    }
}

// Gets
router.get('/:id([0-9]{1,})', getAllImagesForProperty);

// Delete
router.del('/:id([0-9]{1,})', auth, deleteImageById);

// Export object.
module.exports = router;
