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
 * Function that gets the list of all messages for an agent(admin).
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function getMessageByForAgent(cnx) {
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

/**
 * Function that adds a message .
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function addMessages(cnx) {
    const { body } = cnx.request;

    let result;
    try {
        result = await model.addMessage(body);
        if (result) {
            // message addedd
            cnx.status = 201;
            cnx.body = { id: result.insertId, created: true };
        }
    } catch (error) {
        // message not addedd
        cnx.status = 501;
        cnx.body = { error, created: false };
    }
}

/**
 * Function that toggles the archived property of a message.
 * @param {object} cnx - The request object.
 * @returns {object} cnx - The response object.
 */
async function toggleArchived(cnx) {
    const messageID = cnx.params.id;

    // check permission if user can update a feature
    const permission = permissions.toggleArchived(cnx.state.user);

    if (!permission.granted) {
        // if permission is not granted
        cnx.status = 403;
    } else {
        const result = await model.toggleArchived(messageID);
        if (result.affectedRows > 0) {
            cnx.status = 200;
            cnx.body = { ID: messageID, updated: true, link: `${cnx.request.path}/${messageID}` };
        } else {
            cnx.status = 501;
            cnx.body = { ID: messageID, updated: false };
        }
    }
}

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
                cnx.status = 501;
                cnx.body = { ID: messageID, deleted: false };
            }
        }
    } else {
        cnx.status = 404;
    }
}

// Gets
router.get('/agent/:id([0-9]{1,})', auth, getMessageByForAgent);

// Puts
router.put('/:id([0-9]{1,})', auth, toggleArchived);

// Delete
router.del('/:id([0-9]{1,})', auth, deleteMessageById);

// Post
router.post('/', auth, bodyParser(), validateMessageAdd, addMessages);

// Export object.
module.exports = router;
