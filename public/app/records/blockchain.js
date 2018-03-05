const app = require('../main')
const toastr = require('toastr')
const salert = require('sweetalert')

app.controller('blockchainctrl', ['$scope', 'HTTP', 'Upload', ($scope, HTTP, Upload) => {
    $('#navUserRecordsSearch').addClass('active');
    window.s = $scope
    $scope.addApp = addApp
    $scope.deploy = deploy


    HTTP.get(`/api/v1/vms/blockchain/${blockchain_id}`)
    .fork(e=>$scope.server=[],d=>{
        $scope.servers=d.map(vm => Object.assign(vm,{ticked:true}))
    })

    HTTP.get(`/api/v1/app/b_id/${blockchain_id}`)
    .fork(e => $scope.apps = [],d => $scope.apps = d )


    function addApp(app){
        if($scope.serverList.length === 0) toastr.error('Choose server')
        HTTP.post('/api/v1/app/add',Object.assign(app, {blockchain_id: blockchain_id, vms: $scope.serverList}))
        .chain(d => HTTP.post('/commands/start-blockchain-webapp', {machines: $scope.serverList.map(m => m.name), name: app.name, url: app.url}))
        .fork(e => fail(e), d => {
          toastr.success('Application Added')
          window.open("http://"+$scope.serverList[0].ip+":4000", "_blank");
          // window.location.href="/"
        })
    }

    function deploy(app){
        // this is a already saved app, so has everything
        HTTP.post('/api/v1/app/add/vm',Object.assign(app,{vms:$scope.serverList}))
        .chain(d => HTTP.post('/commands/start-blockchain-webapp', {machines: $scope.serverList.map(m => m.name), name: app.name, url: app.url}))
        .fork(e => fail(e),d=>{
        toastr.success('Application Added')
        // window.location.href="/"
        })
    }


    function fail(err) {
        toastr.error('Something went wrong')
        console.log(err)
    }
}])
