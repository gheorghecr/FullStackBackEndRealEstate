/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
/**
* A module to run SQL queries on MySQL on behalf of the API models.
* @module helpers/database
* @author Gheorghe Craciun
* @see models/* for the models that require this module
*/
const mysql = require('promise-mysql');

const { v4: uuidv4 } = require('uuid');

const info = require('../config');

/**
* Run an SQL query against the DB, end the connection and return the result.
* @param {string} Query SQL query string in sqljs format
* @param {array|number|string} values The values to inject in to the query string.
* @returns {object} mysqljs results object containing indexable rows
* @throws {DatabaseException} Custom exception for DB query failures
*/
exports.run_query = async function run_query(query, values) {
    try {
        const connection = await mysql.createConnection(info.config);
        const data = await connection.query(query, values);
        await connection.end();
        return data;
    } catch (error) {
    /**
     * Avoing to send sensitive information to the response object.
     * Log it and throw a generic error.
     */
        const errorId = uuidv4();
        console.error(Date.now(), errorId, query, values, error.message);
        throw new DatabaseException('Database error.', error.code, errorId);
    }
};

/**
 * A custom error constructor to re-raise DB errors in a sanitized way.
 * @class
 * @param {string} message - the error message
 * @param {number|string} code - the original error's error code
 * @param {string} id - a UUID identifier for the error instanced
 */
function DatabaseException(message, code, id) {
    this.message = message;
    this.code = code;
    this.id = id;
    this.name = 'DatabaseException';
}
