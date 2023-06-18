require('dotenv').config({path: "vars/.env"});

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  connection.connect(function (err) {
    if(err){
        console.log("error connecting");
    }
    else{
        console.log("connection successfully");
    }
 });

 module.exports = connection;