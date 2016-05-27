var DiplomControllers = angular.module('DiplomControllers', ['ngMaterial', 'ngCookies']);

DiplomControllers.controller('diplomController', ['$scope', '$timeout', '$http',
  function ($scope, $timeout, $http) {
    $scope.formData = {};
    $scope.submit = function(){
      if ($scope.formData.url){
        var posting = $http({
          method: 'POST',
          url: '/api/parser/',
          data: $scope.formData,
          processData: false
        }).then(function (res){
          $scope.mainSentences = res.data.str;
          $scope.topics = res.data.topics;
        })
      }else{
        alert("Please input url.");
      }
    }
    $scope.user = null;
    $scope.users = null;
    $scope.loadUsers = function() {
        // Use timeout to simulate a 650ms request.
        return $timeout(function() {
          $scope.users =  $scope.users  || [
            { id: 1, name: 'User1' },
            { id: 2, name: 'User2' },
            { id: 3, name: 'User3' },
            { id: 4, name: 'User4' },
            { id: 5, name: 'User5' }
          ];
        }, 650);
      };
    // var data = {
    //     labels: [
    //         "Red",
    //         "Green",
    //         "Yellow"
    //     ],
    //     datasets: [
    //         {
    //             data: [300, 50, 100],
    //             backgroundColor: [
    //                 "#FF6384",
    //                 "#36A2EB",
    //                 "#FFCE56"
    //             ],
    //             hoverBackgroundColor: [
    //                 "#FF6384",
    //                 "#36A2EB",
    //                 "#FFCE56"
    //             ]
    //         }]
    // };
    window.onload = function(){
      var pieData = [
            {
                value: 20,
                color:"#878BB6"
            },
            {
                value : 40,
                color : "#4ACAB4"
            },
            {
                value : 10,
                color : "#FF8153"
            },
            {
                value : 30,
                color : "#FFEA88"
            }
        ];
        // Get the context of the canvas element we want to select
        var countries= document.getElementById("result").getContext("2d");
        new Chart(countries).Pie(pieData);
      // var canvasResult = document.getElementById('result');
      // var ctx = canvasResult.getContext("2d");
      // var myPieChart = new Chart(ctx,{
      //   type: 'pie',
      //   data: data,
      //   options: {
      //     elements: {
      //         arc: {
      //             borderColor: "#000000"
      //         }
      //     }
      //   }
      // });
    }
  }]);
