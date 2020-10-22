/**
* A module to set up the application and it's routes for the Real Estate Website.
* @module index
* @author Gheorghe Craciun
* @see routes/* for all routes
*/

const Koa = require('koa');

const app = new Koa();

const properties = require('./routes/properties_routes.js');
const users = require('./routes/users_routes.js');
const categories = require('./routes/categories_routes.js');

app.use(properties.routes());
app.use(users.routes());
app.use(categories.routes());

// Run the app as a process on a given port
const port = process.env.PORT || 3000;

app.listen(port);
