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
ac.grant('admin').execute('delete').on('properties');
ac.grant('admin').execute('update').on('properties');
ac.grant('admin').execute('create').on('properties');
ac.grant('admin').execute('update').on('properties');

exports.readAllAdmin = (requester) => ac.can(requester.role).context({ role: requester.role }).execute('read').sync().on('properties');
exports.deleteProp = (requester) => ac.can(requester.role).execute('delete').sync().on('properties');
exports.toggleHighPriority = (requester) => ac.can(requester.role).execute('update').sync().on('properties');
exports.addProperty = (requester) => ac.can(requester.role).execute('create').sync().on('properties');
exports.update = (requester) => ac.can(requester.role).execute('update').sync().on('properties');
