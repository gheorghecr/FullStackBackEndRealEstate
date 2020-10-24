/**
* A module to handle permissions on categories.
* @module permissions/categories_permissions
* @author Gheorghe Craciun
*/

const AccessControl = require('role-acl');

const ac = new AccessControl();

// Normal User permissions
ac.grant('user').execute('read').on('categories');

// Admin permissions
ac.grant('admin').execute('delete').on('categories');
ac.grant('admin').execute('create').on('categories');
ac.grant('admin').execute('update').on('categories');

exports.deleteCategory = (requester) => ac.can(requester.role).execute('delete').sync().on('categories');
exports.addCategory = (requester) => ac.can(requester.role).execute('create').sync().on('categories');
exports.updateCategory = (requester) => ac.can(requester.role).execute('update').sync().on('categories');
