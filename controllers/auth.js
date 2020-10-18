/**
* A module to handle user authentication .
* @module controllers/auth
* @author Gheorghe Craciun
*/
const passport = require('koa-passport');

const basicAuth = require('../strategies/basic');

passport.use(basicAuth);

module.exports = passport.authenticate(['basic'], { session: false });
