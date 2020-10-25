/**
* A module to handle the messages routes.
* @module routes/message_routes
* @author Gheorghe Craciun
*/

const Router = require('koa-router');

const bodyParser = require('koa-bodyparser');

// Connect with model for DB
const model = require('../models/messages_model');

// Import auth part
const auth = require('../controllers/auth');

// Deal with Permissions
const permissions = require('../permissions/messages_permissions');

// Validation Schemas
const { validateMessageAdd } = require('../controllers/validation');

// Since we are handling users use a URI that begin's with an appropriate path
const router = Router({ prefix: '/api/messages' });

/**
 * Function that gets the list of all messages for a conversation.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function getAllMessagesForConversation(cnx) {
    const conversationID = cnx.params.id;

    const permission = permissions.readAllForConversation(cnx.state.user);

    if (!permission.granted) {
        // if permission is not granted
        cnx.status = 403;
    } else {
        const result = await model.getAllMessagesForConversation(conversationID);
        if (result.length) {
            cnx.status = 200;
            cnx.body = result;
        } else {
            cnx.status = 404;
        }
    }
}

// /**
//  * Function that gets the list of messages for a given property.
//  * @param {object} cnx - The request object.
//  * @returns {object} cnx - The response object.
//  */
// async function getAllmessagesForProperty(cnx) {
//     const propID = cnx.params.id;

//     const result = await model.getmessagesForProperty(propID);
//     if (result.length) {
//         cnx.status = 200;
//         cnx.body = result;
//     } else {
//         cnx.status = 404;
//     }
// }

/**
 * Function that adds a message .
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function addMessages(cnx) {
    const { body } = cnx.request;

    const result = await model.addMessage(body);
    if (result) {
        // message addedd
        cnx.status = 201;
        cnx.body = { id: result.insertId, created: true, link: `${cnx.request.path}/messageID/${result.insertId}` };
    } else {
        // message not addedd
        cnx.status = 501;
        cnx.body = { id: result.insertId, created: false };
    }
}

// /**
//  * Function that updates a feature by it's ID.
//  * @param {object} cnx - The request object.
//  * @returns {object} cnx - The response object.
//  */
// async function updateById(cnx) {
//     const featureID = cnx.params.id;

//     // check permission if user can update a feature
//     const permission = permissions.updateFeature(cnx.state.user);

//     const { body } = cnx.request;

//     if (!permission.granted) {
//         // if permission is not granted
//         cnx.status = 403;
//     } else {
//         const result = await model.updateFeature(featureID, body);
//         if (result.changedRows > 0) {
//             cnx.status = 200;
//             cnx.body = { ID: featureID, updated: true, link: `${cnx.request.path}/${featureID}` };
//         } else {
//             cnx.status = 501;
//             cnx.body = { ID: featureID, updated: false };
//         }
//     }
// }

/**
 * Function that deletes a message by it's ID.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function deleteMessageById(cnx) {
    const messageID = cnx.params.id;

    const message = await model.getMessageByID(messageID);

    // if message is found in the database continue
    // otherwise send error message back saying message not found
    if (message.length) {
        // check permission if user can delete message
        const permission = permissions.deleteByID(cnx.state.user, message[0]);
        if (!permission.granted) {
            // if permission is not granted
            cnx.status = 403;
        } else {
            // perform delete on database
            const result = await model.deleteMessageByID(messageID);
            if (result.affectedRows > 0) {
                cnx.status = 200;
                cnx.body = { ID: messageID, deleted: true };
            } else {
                cnx.status = 400;
                cnx.body = { ID: messageID, deleted: false };
            }
        }
    } else {
        cnx.status = 404;
    }
}

// Gets
router.get('/:id([0-9]{1,})', auth, getAllMessagesForConversation);
//router.get('/messageID/:id([0-9]{1,})', getAllmessagesForProperty); // Get by messageID

// Delete
router.del('/:id([0-9]{1,})', auth, deleteMessageById);

// Post
router.post('/', auth, bodyParser(), validateMessageAdd, addMessages);

// // Put
// router.put('/:id([0-9]{1,})', auth, bodyParser(), validateFeatureUpdate, updateById);

// Export object.
module.exports = router;
