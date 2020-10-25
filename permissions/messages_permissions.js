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
ac.grant('user').condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } }).execute('delete').on('messages');

// Admin permissions
ac.grant('admin').execute('read').on('messages');
ac.grant('admin').condition({ Fn: 'NOT_EQUALS', args: { 'requester': '$.owner' } }).execute('delete').on('messages');
ac.grant('admin').condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } }).execute('delete').on('messages');

exports.readAllForConversation = (requester) => ac.can(requester.role).execute('read').sync().on('messages');
exports.deleteByID = (requester, data) => ac.can(requester.role).context({ requester: requester.userID, owner: data.fromID }).execute('delete').sync().on('messages');
