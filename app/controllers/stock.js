 var app = angular.module('myApp',[]);
 app.controller('my-ctrl',['$scope','$http',function($scope,$http){
   var seriesOption=[];
   var vm = this;
     vm.board=[];
   var socket = window.io(window.location.origin+'/');
//Load stock từ database
  socket.emit('getStock');
  socket.on("reStocks",function(data){
    console.log(data);
    var chartData=[];
    data.forEach(function(item){
      chartData.push(item);
    });
    Highcharts.stockChart('container', {

      rangeSelector: {
            selected: 1
        },

        title: {
            text: 'Chart The Stock Market'
        },

        series: chartData
    });
    $scope.$apply(function(){
      data.forEach(function(item){
        vm.board.push(item);
      });
    });

  });
//Khi một user thêm 1 code mới
socket.on('new-stock',function(data){
  $scope.$apply(function(){
    vm.board.push(data);
  });
  Highcharts.stockChart('container', {

    rangeSelector: {
          selected: 1
      },

      title: {
          text: 'Chart The Stock Market'
      },

      series: vm.board
  });
});
//Khi user xóa đi 1 code
socket.on('del',function(data){
  $scope.$apply(function(){
    for(var i=0; i<vm.board.length;i++){
      if(vm.board[i].name===data){
        vm.board.splice(i,1);
        break;
      }
    }  
  });

  Highcharts.stockChart('container', {

     rangeSelector: {
           selected: 1
       },

       title: {
           text: 'Chart The Stock Market'
       },

       series: vm.board
   });
});

//Khi user thêm một code mới
  $scope.addCode = function(key){
     var code = key.toUpperCase();
     var codes =[];
     vm.board.forEach(function(item){
        codes.push(item.name);
     });
   if(codes.indexOf(code) === -1){
     $http.get('https://www.quandl.com/api/v3/datasets/WIKI/'+code+'/data.json?api_key=jG86yVpnBSVChzPjPTRj').success(function(res){
       var start = "2012-09-26";
       var temp = [];
       var json = angular.fromJson(res);
       for(var i=0; i<json.dataset_data.data.length;i++){
         if(json.dataset_data.data[i][0]===start) break;
         else{
           temp.push(json.dataset_data.data[i]);
         }
       }
       var data = temp.map(function(d) {
          return [new Date(d[0]).getTime(), d[4]]
        });
        var stock = {
          name: code,
          data: data.sort(),
          tooltip: {
              valueDecimals: 2
          },
          color: getColor()
        }
        socket.emit("add-stock",stock);
       vm.board.push(stock);

      Highcharts.stockChart('container', {

         rangeSelector: {
               selected: 1
           },

           title: {
               text: 'Chart The Stock Market'
           },

           series: vm.board
       });

     });

   }
   }

$scope.delCode = function(key){
  socket.emit('del-code',key);
  for(var i=0; i<vm.board.length;i++){
    if(vm.board[i].name===key){
      vm.board.splice(i,1);
      break;
    }
  }
  Highcharts.stockChart('container', {

     rangeSelector: {
           selected: 1
       },

       title: {
           text: 'Chart The Stock Market'
       },

       series: vm.board
   });
}


function getColor(){
  var colors = ['#16a085', '#27ae60', '#2c3e50', '#f39c12', '#e74c3c', '#9b59b6', '#FB6964', '#342224', "#472E32", "#BDBB99", "#77B1A9", "#73A857",'#CC3300','#9933FF','#9933CC','#993399','#993366'];
  var color = Math.floor(Math.random() * colors.length);
  return colors[color];
}

 }]);
