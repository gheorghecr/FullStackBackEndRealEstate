/**
* A module to configure the acess to the database. Use the environment settings or given defaults.
* @module cofig.js
* @author Gheorghe Craciun
*/
exports.config = { host: process.env.DB_HOST || "localhost", 
                  port: process.env.DB_PORT || 3306,
                  user: process.env.DB_USER || "root", 
                  password: process.env.DB_PASSWORD || "codio", 
                  database: process.env.DB_DATABASE || "real_estate", 
                  connection_limit: 100
                 }