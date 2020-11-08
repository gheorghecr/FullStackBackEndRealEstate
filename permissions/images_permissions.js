/**
* A module to handle permissions on images.
* @module permissions/images_permissions
* @author Gheorghe Craciun
*/

const AccessControl = require('role-acl');

const ac = new AccessControl();

// Normal User permissions
ac.grant('user').execute('read').on('images');

// Admin permissions
ac.grant('admin').execute('delete').on('images');
ac.grant('admin').execute('create').on('images');

exports.deleteImage = (requester) => ac.can(requester.role).execute('delete').sync().on('images');
exports.addImage = (requester) => ac.can(requester.role).execute('create').sync().on('images');
