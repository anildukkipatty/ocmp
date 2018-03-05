require('./pages')
const app  = require('./main')
const salert = require('sweetalert')
const socket = io.connect()
const tt = (buff) => String.fromCharCode.apply(null, new Uint8Array(buff))
const ft = str => str.replace(/\[[0-9]*m/g, '')

socket.on('userRecords-update-notify', record => {
  salert('User record update tracked', `User record with ${getDetails(record)} has been updated`, 'info')
})

app.controller('MainCtrl', ['$scope', '$http','HTTP', ($scope, $http,HTTP) => {
  $('[data-toggle="tooltip"]').tooltip()
  window.s = $scope
  $scope.dataRoom = []
  $scope.goTo = function  (link) {
  	window.location.href = link
  }
  $scope.activeUserProfile = me

  socket.on('data-room', data => {
    $scope.dataRoom.push({message: ft(tt(data))})
    $scope.dataRoom = $scope.dataRoom.slice(-20)
    $scope.$apply()
  })


  $scope.goToW = function  (link) {
  	window.open(link)
  }
}])
