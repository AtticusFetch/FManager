var ProfileControllers = angular.module('ProfileControllers', ['ngMaterial', 'ngCookies']);

ProfileControllers.controller('profileController', ['$routeParams', '$scope', '$rootScope', '$location', '$timeout', '$mdSidenav', '$mdUtil', '$log', '$cookies',
    function ($routeParams, $scope, $rootScope, $location, $timeout, $mdSidenav, $mdUtil, $log, $cookies) {
        $scope.authMessage = '';
        if (!$cookies.IsLogged) {
            alert('You are not logged on!');
            $location.url('/');
        } else {
            $scope.currUsername = $cookies.username;
            $scope.authMessage = $scope.currUsername + "'s profile page";
            $scope.currEmail = $cookies.email;
        }
        $scope.logOut = function () {
            delete $cookies.IsLogged;
            delete $cookies.username;
            delete $cookies.email;
            delete $cookies.userId;
            $location.url('/');
        };
        $scope.toggleLeft = buildToggler('left');
        function buildToggler(navID) {
            var debounceFn = $mdUtil.debounce(function () {
                $mdSidenav(navID)
                    .toggle()
            }, 300);
            return debounceFn;
        }
    }]);