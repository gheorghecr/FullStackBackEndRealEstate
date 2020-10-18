/**
* A module to handle permissions on USERS.
* @module permissions/user_permissions
* @author Gheorghe Craciun
*/

const AccessControl = require('role-acl');

const ac = new AccessControl();

// Normal User permissions
ac.grant('user').condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } }).execute('read').on('user', ['*', '!password', '!passwordSalt', '!role', '!signUpCode']);
ac.grant('user').condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } }).execute('update').on('user', ['firstName', 'lastName', 'about', 'password', 'email', 'avatarURL']);

// Admin permissions
ac.grant('admin').execute('read').on('user');
ac.grant('admin').execute('read').on('users');
ac.grant('admin').execute('update').on('user');
ac.grant('admin').condition({ Fn: 'NOT_EQUALS', args: { 'requester': '$.owner' } }).execute('delete').on('user');

exports.readAll = (requester) => ac.can(requester.role).execute('read').sync().on('users');
exports.read = (requester, data) => ac.can(requester.role).context({ requester: requester.userID, owner: data.userID }).execute('read').sync().on('user');
exports.update = (requester, data) => ac.can(requester.role).context({ requester: requester.userID, owner: data.userID }).execute('update').sync().on('user');
exports.delete = (requester, data) => ac.can(requester.role).context({ requester: requester.userID, owner: data.userID }).execute('delete').sync().on('user');
