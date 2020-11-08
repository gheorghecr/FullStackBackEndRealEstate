/* eslint-disable no-restricted-syntax */
/**
* A module to handle the images routes.
* @module routes/images_routes
* @author Gheorghe Craciun
*/

const fs = require('fs-extra');

const Router = require('koa-router');

const multer = require('koa-multer');

const bodyParser = require('koa-bodyparser');

// Connect with model for DB
const model = require('../models/images_model');

// Import auth part
const auth = require('../controllers/auth');

// Deal with Permissions
// const permissions = require('../permissions/features_permissions');

// Validation Schemas
// const { validateFeatureAdd, validateFeatureUpdate } = require('../controllers/validation');

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
    cnx.body = true;
    cnx.status = 200;
    //const result = await model.getAllImagesForProperty(propID);
    // if (result.length) {
    //     cnx.status = 200;
    //    
    //     //cnx.body = result;

    // } else {
    //     cnx.status = 404;
    // }
}

/**
 * Function that adds an image to a property.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
// TODO: Write api doc. Add permission. And Validation
async function addImage(cnx) {
    const propID = cnx.params.id;
    const { files } = cnx.req;

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
            // TODO: Update link to retrieve image
            cnx.body = { id: result.insertId, created: true, link: `${cnx.request.path}/messageID/${result.insertId}` };
        } else {
            // image not addedd
            cnx.status = 501;
            cnx.body = { id: result.insertId, created: false };
        }
    }
}

// Gets
router.get('/:id([0-9]{1,})', getAllImagesForProperty);

// Delete
// router.del('/:id([0-9]{1,})', auth, deleteById);

// Post
router.post('/:id([0-9]{1,})', upload.array('file'), auth, bodyParser(), addImage);

// // Put
// router.put('/:id([0-9]{1,})', auth, bodyParser(), validateFeatureUpdate, updateById);
// router.allowedMethods();
// Export object.
module.exports = router;
