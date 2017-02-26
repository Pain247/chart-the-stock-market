var express = require('express');
var app = express();
var http = require('http').Server(app);
var socketIO = require(process.cwd() + '/app/controllers/controller.server.js');
http.listen(process.env.PORT||8080);
var io = require('socket.io')(http);
var routes = require('./app/routes/index.js');
require('dotenv').load();
var mongo = require('mongodb').MongoClient;

mongo.connect(process.env.MONGO_URI,function(err,db){
  app.use('/controllers',express.static(process.cwd()+'/app/controllers'));
  app.use('/public',express.static(process.cwd()+'/public'));
  routes(app);
  socketIO(io,db);

})
