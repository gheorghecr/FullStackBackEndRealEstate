/* eslint-disable no-restricted-syntax */
/**
* A module to handle the images routes.
* @module routes/images_routes
* @author Gheorghe Craciun
*/

// Used to store the image
const fs = require('fs-extra');

const Router = require('koa-router');

// Used to get an file
const multer = require('koa-multer');

const bodyParser = require('koa-bodyparser');

// Connect with model for DB
const model = require('../models/images_model');

// Import auth part
const auth = require('../controllers/auth');

// Deal with Permissions
const permissions = require('../permissions/images_permissions');

// Validation Schemas
const { validateImageAdd } = require('../controllers/validation');

// Since we are handling users use a URI that begin's with an appropriate path
const router = Router({ prefix: '/api/images' });

// Used in order to get the images from the user
const upload = multer({
    storage: multer.memoryStorage(),
});

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
 * Function that adds an image to a property.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function addImage(cnx) {
    const propID = cnx.params.id;
    const { files } = cnx.req;

    const permission = permissions.addImage(cnx.state.user);

    if (!permission.granted) {
        // if permission is not granted
        cnx.status = 403;
    } else {
        for (const file of files) {
            const fileNameForDB = `${Date.now()}.${file.originalname}`;
            // Convert buffer bytes to bitmap
            const bitmap = Buffer.from(file.buffer, 'base64');
            // Save the image to the right folder
            fs.writeFileSync(`public/${fileNameForDB}`, bitmap);
            const result = model.storeImageName(propID, fileNameForDB);
            if (result) {
                // image addedd
                cnx.status = 201;
                // TODO: Update link to retrieve image (is it possible to have just the host?)
                cnx.body = { id: result.insertId, created: true, link: `/${fileNameForDB}` };
            } else {
                // image not addedd
                cnx.status = 501;
                cnx.body = { id: result.insertId, created: false };
            }
        }
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

// Post
router.post('/:id([0-9]{1,})', upload.array('file'), auth, bodyParser(), validateImageAdd, addImage);

// Export object.
module.exports = router;
