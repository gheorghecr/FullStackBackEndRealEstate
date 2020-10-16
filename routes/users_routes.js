const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

// Connect with model for DB
const model = require('../models/users_model');

// Import auth part
//const auth = require('../controllers/auth');

// Password encryption
const bcrypt = require('bcrypt');

// Validation Schemas
//const {validateUser, validateUserUpdate} = require('../controllers/validation');

// Deal with Permissions
const permissions = require('../permissions/users_permissions');

// Since we are handling articles use a URI that begings with an appropriate path
const router = Router({prefix: '/api/v1/users'});


router.get('/', /*auth,*/ getAll);
router.post('/', bodyParser(), /*validateUser,*/  createAccount);

router.get('/:id([0-9]{1,})', /*auth,*/ getById);
router.put('/:id([0-9]{1,})', /*auth,*/ bodyParser(), /*validateUserUpdate,*/ updateArticle);
router.del('/:id([0-9]{1,})', /*auth,*/ deleteUserById);


//Now we define the handler functions used abose.

async function getAll(cnx) {
  const permission = permissions.readAll(cnx.state.user);
  if (!permission.granted) {
    cnx.status = 403;
  } else {
    const result = await model.getAll();
    if (result.length) {
      cnx.body = result;
    }
  }
}

async function getById(cnx){ 
  let id = cnx.params.id; 
  let article =  await model.getUserInfoById(id);
  
  const permission = permissions.read(cnx.state.user, article[0]);
  
  //filter data which user cannot see
  article[0] = permission.filter(article[0])

  if (!permission.granted) {
    cnx.status = 403;
  } else {
    if (article.length) {
    cnx.body = article[0];
    }
  }
}

//create account 
async function createAccount(cnx) { 
  let body = cnx.request.body; 
  
  //hash password
  const hash = bcrypt.hashSync(body.password, 10);
  body.password = hash;
  
  let result =  await model.register(body);
  if (result) {
    cnx.status = 201;
    console.log(result)
    cnx.body = {ID: result.insertId}
  }
}

async function updateArticle(cnx) { 
  let id = cnx.params.id; 
  let body = cnx.request.body; 
  
  //get the article first (check if exisits)
  let article =  await model.getUserInfoById(id);
  
  //check permission
  const permission = permissions.update(cnx.state.user, article[0]);
  
  if (!permission.granted) {
    cnx.status = 403;
  } else {
    let result =  await model.updateById(id, body);
    if (result.affectedRows > 0) {
      cnx.status = 201;
      cnx.body = {Message: "Article Updated succesfully"};
      console.log(result)
    } else {
      cnx.status = 404;
      cnx.body = {Message: "Nothing was updated"};
      console.log(result)
    }
  }
}

async function deleteUserById(cnx){ 
  /// Get the ID from the route parameters. 
  let id = cnx.params.id; 
  
  let result = await model.deleteAccountById(id);
  // If it exists then return the article as JSON. 
  // Otherwise return a 404 Not Found status code
  if (result) {
    cnx.status = 201;
    cnx.body = {Message: "Article Deleted succesfully"};
  } else {
    cnx.status = 404; 
  }  
}

// Finally, define the exported object when 'require'd from other scripts. Small Change to test git email
module.exports = router; 