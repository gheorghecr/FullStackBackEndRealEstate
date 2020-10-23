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

exports.deleteCategory = (requester) => ac.can(requester.role).execute('delete').sync().on('categories');