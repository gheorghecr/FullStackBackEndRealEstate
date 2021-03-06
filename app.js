/**
* A module to set up the application and it's routes for the Real Estate Website.
* @module index
* @author Gheorghe Craciun
* @see routes/* for all routes
*/

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const cors = require('@koa/cors');

const app = new Koa();

const options = {
    origin: '*',
};

app.use(cors(options));

const properties = require('./routes/properties_routes.js');
const users = require('./routes/users_routes.js');
const categories = require('./routes/categories_routes.js');
const features = require('./routes/features_routes.js');
const messages = require('./routes/messages_routes.js');
const images = require('./routes/images_routes.js');

app.use(properties.routes());
app.use(users.routes());
app.use(categories.routes());
app.use(features.routes());
app.use(messages.routes());
app.use(images.routes());
app.use(bodyParser({ multipart: true }));
app.use(serve('./public'));

module.exports = app;
