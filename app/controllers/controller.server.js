'use strict';

function socketIO(io,db){
  var collection = db.collection('stocks');
  io.on('connection',function(socket){
    socket.on('getStock',function(){
      collection.find({},{_id:0}).toArray(function(err,doc){
        socket.emit('reStocks',doc);
      });
    })

    socket.on('add-stock',function(data){
    socket.broadcast.emit('new-stock',data);
    collection.insert({
        "name" : data.name,
        "data" : data.data,
        "tooltip": data.tooltip,
        "color" : data.color
      });
    });

   socket.on('del-code',function(data){
    socket.broadcast.emit('del',data);
     collection.remove({'name' : data});
   });


  });

}
module.exports = socketIO;
