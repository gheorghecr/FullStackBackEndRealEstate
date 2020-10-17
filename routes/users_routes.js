const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

// Connect with model for DB
const model = require('../models/users_model');

// Import auth part
const auth = require('../controllers/auth');

// Password encryption
const bcrypt = require('bcrypt');

// Validation Schemas
const {validateUser, validateUserUpdate} = require('../controllers/validation');

// Deal with Permissions
const permissions = require('../permissions/users_permissions');

// Since we are handling articles use a URI that begings with an appropriate path
const router = Router({prefix: '/api/users'});


router.get('/', auth, getAll);
router.post('/', bodyParser(), validateUser,  createAccount);

router.get('/:id([0-9]{1,})', auth, getById);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateUserUpdate, updateUserInfo);
router.del('/:id([0-9]{1,})', auth, deleteUserById);


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
  let user =  await model.getUserInfoById(id);
  
  // if user is found in the database continue
  // otherwise send message back saying user not found
  if (user.length) {
    const permission = permissions.read(cnx.state.user, user[0]);
  
    //filter data which user cannot see
    user[0] = permission.filter(user[0])

    if (!permission.granted) {
      cnx.status = 403;
    } else {
      if (user.length) {
        cnx.status = 201;
        cnx.body = user[0];
      }
    }
  } else {
    cnx.status = 404;
    cnx.body = {Message: "User Not found"};
  }
}

//Create account function
async function createAccount(cnx) { 
  let body = cnx.request.body; 
  
  //hash password
  const hash = bcrypt.hashSync(body.password, 10);
  body.password = hash;
  
  let result =  await model.register(body);
  if (result) {
    cnx.status = 201;
    cnx.body = {ID: result.insertId}
  } else {
    cnx.status = 500;
  }
}

//update user personal info
async function updateUserInfo(cnx) { 
  let id = cnx.params.id; 
  let body = cnx.request.body; 
  
  //get the user first, (check if exisits)
  let user =  await model.getUserInfoById(id);
  
  // if user is found in the database continue
  // otherwise send message back saying user not found
  if (user.length) {
    //check permission if user can update info
    const permission = permissions.update(cnx.state.user, user[0]);

    if (!permission.granted) {
      cnx.status = 403;
      cnx.body = {Message: "You don't have permission to update this."};
    } else {
      // if user is updating password encryp it
      if(body.password) {
        body.password = bcrypt.hashSync(body.password, 10);
      }
      //perform update on database
      let result =  await model.updateById(id, body);
      if (result.affectedRows > 0) {
        cnx.status = 201;
        cnx.body = {Message: "Account Updated succesfully"};
      } else {
        cnx.status = 404;
        cnx.body = {Message: "Nothing was updated"};
      }
    }
  } else {
    cnx.status = 404;
    cnx.body = {Message: "User Not found"};
  }
  
}

// Delete account by ID
async function deleteUserById(cnx){ 
  /// Get the ID from the route parameters. 
  let id = cnx.params.id; 
  
  let result = await model.deleteAccountById(id);
  // If it exists then return the article as JSON. 
  // Otherwise return a 404 Not Found status code
  if (result) {
    cnx.status = 201;
    cnx.body = {Message: "Account Deleted succesfully"};
  } else {
    cnx.status = 404; 
  }  
}

// Finally, define the exported object when 'require'd from other scripts. Small Change to test git email
module.exports = router; 