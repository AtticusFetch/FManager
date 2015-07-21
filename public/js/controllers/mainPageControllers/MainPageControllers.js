var MainPageControllers = angular.module('MainPageControllers', ['ngMaterial', 'ngCookies']);

MainPageControllers.controller('mainPageController', ['$http', '$scope', '$rootScope', '$mdDialog', '$location', '$cacheFactory', '$cookies', 'users',
    function ($http, $scope, $rootScope, $mdDialog, $location, $cacheFactory, $cookies, users) {
        var isLogged = $cookies.IsLogged;
        $scope.showRegistrationForm = function (ev) {
            $mdDialog.show({
                controller: registrationController,
                templateUrl: '../../templates/registrationForm.html',
                parent: angular.element(document.body),
                targetEvent: ev
            })
        };
        $scope.showLogInForm = function (ev) {
            $mdDialog.show({
                controller: logInController,
                templateUrl: '../../templates/logInForm.html',
                parent: angular.element(document.body),
                targetEvent: ev
            })
        };
        if (!isLogged) {
            $http.get('/api/mainPage');
        } else {
            $location.url('#/' + $cookies.username);
        }
    }]);

MainPageControllers.controller('mainPageLoggedController', ['$routeParams', '$scope', '$rootScope', '$location', '$timeout', '$mdSidenav', '$mdUtil', '$cookies',
    function ($routeParams, $scope, $rootScope, $location, $timeout, $mdSidenav, $mdUtil, $cookies) {
        $scope.authMessage = '';
        if (!$cookies.IsLogged) {
            alert('You are not logged on!');
            $location.url('#/');
        } else {
            $scope.currUsername = $cookies.username;
            $scope.authMessage = 'You are successfully logged on as ' + $scope.currUsername;
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

function registrationController($scope, $mdDialog, $location, $cookies, users) {
    $scope.formData = {};
    $scope.close = function () {
        $mdDialog.hide();
    };
    $scope.submit = function () {
        if (!$scope.formData.email) {
            alert('Incorrect E-mail address');
        } else {
            users.addUser($scope.formData)
                .success(function (data) {
                    $mdDialog.hide();
                    $cookies.IsLogged = true;
                    $cookies.username = data[0].username;
                    $cookies.email = data[0].email;
                    $cookies.userId = data[0]._id;
                    $location.url('/' + data[0].username);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        }
    }
}

function logInController($scope, $mdDialog, $location, $cookies, $http, users) {
    $scope.formData = {};
    //$http.delete('clearAll');
    //$http.get('/api/getAllUsers');
    //$http.get('/api/getAllExpenses');
    //$http.delete('clearAllExpenses');
    $scope.close = function () {
        $mdDialog.hide();
    };
    $scope.submit = function () {
        users.getUser($scope.formData)
            .success(function (data) {
                $cookies.IsLogged = true;
                $cookies.username = data[0].username;
                $cookies.email = data[0].email;
                $cookies.userId = data[0]._id;
                $location.url('/' + data[0].username);
                $mdDialog.hide();
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    }
}