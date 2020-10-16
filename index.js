// Real Estate Assignemnt
// Set up application and it's routes

const Koa = require('koa'); 
const Router = require('koa-router'); 
const app = new Koa(); 

//const special = require('./routes/special.js');
//const articles = require('./routes/articles.js');
const users = require('./routes/users_routes.js');

//app.use(special.routes());
//.use(articles.routes());
app.use(users.routes());

// Run the app as a process on a given port 
let port =  process.env.PORT || 3000;

app.listen(port);