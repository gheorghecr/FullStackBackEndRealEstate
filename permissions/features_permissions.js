/**
* A module to handle permissions on features.
* @module permissions/features_permissions
* @author Gheorghe Craciun
*/

const AccessControl = require('role-acl');

const ac = new AccessControl();

// Normal User permissions
ac.grant('user').execute('read').on('features');

// Admin permissions
ac.grant('admin').execute('delete').on('features');
ac.grant('admin').execute('create').on('features');
ac.grant('admin').execute('update').on('features');

exports.deleteFeature = (requester) => ac.can(requester.role).execute('delete').sync().on('features');
exports.addFeature = (requester) => ac.can(requester.role).execute('create').sync().on('features');
exports.updateFeature = (requester) => ac.can(requester.role).execute('update').sync().on('features');
