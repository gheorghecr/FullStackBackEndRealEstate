/* eslint-disable newline-per-chained-call */
/* eslint-disable quote-props */
/**
* A module to handle permissions on properties.
* @module permissions/properties_permissions
* @author Gheorghe Craciun
*/

const AccessControl = require('role-acl');

const ac = new AccessControl();

// Normal User permissions
ac.grant('user').condition({ Fn: 'EQUALS', args: { 'role': 'user' } }).execute('read').on('properties', [' ']);

// Admin permissions
ac.grant('admin').condition({ Fn: 'EQUALS', args: { 'role': 'admin' } }).execute('read').on('properties');
ac.grant('admin').condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } }).execute('delete').on('properties');
ac.grant('admin').condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } }).execute('update').on('properties');
ac.grant('admin').condition({ Fn: 'EQUALS', args: { 'role': 'admin' } }).execute('create').on('properties');

exports.readAllAdmin = (requester) => ac.can(requester.role).context({ role: requester.role }).execute('read').sync().on('properties');
exports.deleteProp = (requester, data) => ac.can(requester.role).context({ requester: requester.userID, owner: data.sellerID }).execute('delete').sync().on('properties');
exports.toggleHighPriority = (requester, data) => ac.can(requester.role).context({ requester: requester.userID, owner: data.sellerID }).execute('update').sync().on('properties');
exports.addProperty = (requester) => ac.can(requester.role).context({ role: requester.role }).execute('create').sync().on('properties');
exports.update = (requester, data) => ac.can(requester.role).context({ requester: requester.userID, owner: data.sellerID }).execute('update').sync().on('properties');
