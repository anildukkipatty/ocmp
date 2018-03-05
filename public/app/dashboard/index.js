const app = require('../main')
const salert = require('sweetalert')

app.controller('DashboardCtrl', ['$scope', 'HTTP', 'Upload', function ($scope, HTTP, Upload) {
  HTTP.get('/api/v1/dashboard-meta')
    .fork(err => {
      console.log(err)
      salert('APIs failed', `Please check the logs and fix the issues`, 'warning')
    }, data => {
      $scope.meta = data
    })
}])
