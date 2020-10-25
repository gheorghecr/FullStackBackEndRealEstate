/**
* A module to perform query's related with the messages on the database.
* @module models/messages_model
* @author Gheorghe Craciun
*/
const db = require('../helpers/database');

/**
 * SQL Query function to get all messages for a conversationID from the DB.
 * @param {integer} conversationID - conversation ID.
 * @returns {object} data - The response object containing all features.
 */
// eslint-disable-next-line max-len
exports.getAllMessagesForConversation = async function getAllMessagesForConversation(conversationID) {
    const query = 'SELECT * FROM messages WHERE conversationID = ?';
    const data = await db.run_query(query, conversationID);
    return data;
};
