/* eslint-disable no-console */
/**
* A module to run JSON Schema based validation on request/response data.
* @module controllers/validation
* @author Gheorghe Craciun
* @see schemas/* for JSON Schema definition files
*/

const { Validator, ValidationError } = require('jsonschema');

const userSchema = require('../schemas/user_schema.json').definitions.user;

const userUpdateSchema = require('../schemas/user_schema.json').definitions.userUpdate;

const propertyAddSchema = require('../schemas/properties_schema.json').definitions.addProperty;

const propertyUpdateSchema = require('../schemas/properties_schema.json').definitions.updateProperty;

const categoryAddSchema = require('../schemas/categories_schema.json').definitions.addCategory;

const categoryUpdateSchema = require('../schemas/categories_schema.json').definitions.updateCategory;

const featureAddSchema = require('../schemas/features_schema.json').definitions.addFeatures;

const featureUpdateSchema = require('../schemas/features_schema.json').definitions.updateFeature;

const addMessageSchema = require('../schemas/messages_schema.json').definitions.addMessage;

/**
 * Wrapper that returns a Koa middleware validator for a given schema.
 * @param {object} schema - The JSON schema definition of the resource
 * @param {string} resource - The name of the resource e.g. 'article'
 * @returns {function} - A Koa middleware handler taking (ctx, next) params
 */
const makeKoaValidator = (schema, resource) => {
    const v = new Validator();
    const validationOptions = {
        throwError: true,
        propertyName: resource,
    };

    /**
   * Koa middleware handler function to do validation
   * @param {object} ctx - The Koa request/response context object
   * @param {function} next - The Koa next callback
   * @throws {ValidationError} a jsonschema library exception
   */
    const handler = async (ctx, next) => {
        const { body } = ctx.request;
        try {
            v.validate(body, schema, validationOptions);
            await next();
        } catch (error) {
            if (error instanceof ValidationError) {
                console.error(error);
                ctx.body = { message: error };
                ctx.status = 400;
            } else {
                throw error;
            }
        }
    };
    return handler;
};

/** Validate data against user schema for creating new users */
exports.validateUser = makeKoaValidator(userSchema, 'user');
/** Validate data against user schema for updating existing users */
exports.validateUserUpdate = makeKoaValidator(userUpdateSchema, 'userUpdate');

/** Validate data against properties schema for adding a new property */
exports.validatePropertyAdd = makeKoaValidator(propertyAddSchema, 'addProperty');
/** Validate data against properties schema for updating a property */
exports.validatePropertyUpdate = makeKoaValidator(propertyUpdateSchema, 'updateProperty');

/** Validate data against categories schema for adding a category */
exports.validateCategoryAdd = makeKoaValidator(categoryAddSchema, 'addCategory');
/** Validate data against categories schema for adding a category */
exports.validateCategoryUpdate = makeKoaValidator(categoryUpdateSchema, 'updateCategory');

/** Validate data against features schema for adding a feature */
exports.validateFeatureAdd = makeKoaValidator(featureAddSchema, 'addFeature');
/** Validate data against features schema for adding a feature */
exports.validateFeatureUpdate = makeKoaValidator(featureUpdateSchema, 'updateFeature');

/** Validate data against messages schema for adding a message */
exports.validateMessageAdd = makeKoaValidator(addMessageSchema, 'addMessage');
