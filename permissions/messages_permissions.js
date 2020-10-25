/* eslint-disable newline-per-chained-call */
/* eslint-disable quote-props */
/**
* A module to handle permissions on messages.
* @module permissions/message_permissions
* @author Gheorghe Craciun
*/

const AccessControl = require('role-acl');

const ac = new AccessControl();

// Normal User permissions
ac.grant('user').condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } }).execute('read').on('messages');

// Admin permissions
ac.grant('admin').execute('read').on('messages');

exports.readAllForConversation = (requester) => ac.can(requester.role).execute('read').sync().on('messages');
