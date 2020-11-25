/**
* A module to perform query's related with the messages on the database.
* @module models/messages_model
* @author Gheorghe Craciun
*/
const db = require('../helpers/database');

/**
 * SQL Query function to get all messages for an agent from the DB.
 * @param {integer} agentID - agent ID.
 * @returns {object} data - The response object containing all features.
 */
exports.getAllMessagesForAgent = async function getAllMessagesForAgent(agentID) {
    const query = 'SELECT * FROM messages WHERE agentID = ?';
    const data = await db.run_query(query, agentID);
    return data;
};

/**
 * SQL Query function to get an message by it's ID.
 * @param {object} messageID - The message ID.
 * @returns {object} data - The response object.
 */
exports.getMessageByID = async function getMessageByID(messageID) {
    const query = 'SELECT * FROM messages WHERE messageID = ?;';
    const data = await db.run_query(query, messageID);
    return data;
};

/**
 * SQL Query function to add a message.
 * @param {object} message - The message object.
 * @returns {object} data - The response object.
 */
exports.addMessage = async function addMessage(message) {
    const query = 'INSERT INTO messages SET ?;';
    const data = await db.run_query(query, message);
    return data;
};

/**
 * SQL Query function to delete an message by it's ID.
 * @param {object} messageID - The message ID.
 * @returns {object} data - The response object.
 */
exports.deleteMessageByID = async function deleteMessageByID(messageID) {
    const query = 'DELETE FROM messages WHERE messageID = ?;';
    const data = await db.run_query(query, messageID);
    return data;
};

/**
 * SQL Query function to toggle the archived attribute of a message by it's ID.
 * @param {integer} messageID - message ID.
 * @returns {object} data - The response object.
 */
exports.toggleArchived = async function toggleArchived(messageID) {
    const query = 'UPDATE messages SET archived = !archived WHERE messageID = ?';
    const data = await db.run_query(query, messageID);
    return data;
};
