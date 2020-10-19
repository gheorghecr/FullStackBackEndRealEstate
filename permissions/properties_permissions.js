/**
* A module to handle permissions on properties.
* @module permissions/user_permissions
* @author Gheorghe Craciun
*/

const AccessControl = require('role-acl');

const ac = new AccessControl();

// Normal User permissions
ac.grant('user').condition({ Fn: 'EQUALS', args: { 'role': 'admin' } }).execute('read').on('properties', [' ']);

//mAdmin permissions
ac.grant('admin').condition({ Fn: 'EQUALS', args: { 'role': 'admin' } }).execute('read').on('properties');
ac.grant('admin').condition({ Fn: 'NOT_EQUALS', args: { 'requester': '$.owner' } }).execute('delete').on('properties');

exports.readAllAdmin = (requester) => ac.can(requester.role).context({ role: requester.role}).execute('read').sync().on('properties');
exports.deleteProp = (requester, data) => ac.can(requester.role).context({ requester: requester.userID, owner: data.sellerID }).execute('delete').sync().on('properties');