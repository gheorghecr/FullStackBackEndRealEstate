/**
* A module to set up the application documentation and it's routes for the Real Estate Website.
* @module docs.js
* @author Gheorghe Craciun
*/
const Koa = require('koa');
const serve = require('koa-static');
const mount = require('koa-mount');
const app = new Koa();

app.use(mount('/', serve('./docs/jsdocs')))  // serve JSDocs
app.use(mount('/openapi', serve('./docs/openapi')))  // serve OpenAPI
app.use(mount('/schemas', serve('./schemas')))  // serve schemas

let port = process.env.PORT || 3030;

app.listen(port);
console.log(`OpenAPI server running on port ${port}`);