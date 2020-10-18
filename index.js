/**
* A module to set up the application and it's routes for the Real Estate Website.
* @module index
* @author Gheorghe Craciun
* @see routes/* for all routes
*/

const Koa = require('koa');

// const Router = require('koa-router'); //DELETE THIS AT THE END

const app = new Koa();

// const special = require('./routes/special.js');
// const articles = require('./routes/articles.js');
const users = require('./routes/users_routes.js');

// app.use(special.routes());
// .use(articles.routes());
app.use(users.routes());

// Run the app as a process on a given port
const port = process.env.PORT || 3000;

app.listen(port);
