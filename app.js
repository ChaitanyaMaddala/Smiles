var express = require("express");
var bodyParser = require("body-parser");
var mysql = require('mysql');
var http = require('http');

var app = express();

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'root',
  database : 'smiles_schema'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

app.connection = connection;
app.connection.connect(function(err){
  if(err){
    console.log('Error connecting to Db'+err);
    return;
  }
});
app.connection.query('USE smiles_schema');

var routes = require("./routes/routes.js")(app);
 
var server = app.listen(3300, function () {
  console.log("Listening on port %s...", server.address().port);
});