'use strict';
var path = process.cwd();
var body = require('body-parser');
var urlencoded = body.urlencoded({extended :false});

module.exports= function(app){
  app.get('/',function(req,res){
    res.sendFile(path+'/public/index.html');
  })
}
