/**
 * Created by Ivan_Iankovskyi on 7/8/2015.
 */
'use strict';

var FManagerControllers = angular.module('FManagerControllers', ['ngMaterial', 'ngCookies']);

FManagerControllers.controller('mainPageController', ['$http', '$scope', '$rootScope', '$mdDialog', '$location', '$cacheFactory', '$cookies', 'users',
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
            $location.url('/' + $cookies.username);
        }
    }]);

FManagerControllers.controller('mainPageLoggedController', ['$routeParams', '$scope', '$rootScope', '$location', '$timeout', '$mdSidenav', '$mdUtil', '$log', '$cookies', 'users',
    function ($routeParams, $scope, $rootScope, $location, $timeout, $mdSidenav, $mdUtil, $log, $cookies, users) {
        $scope.authMessage = '';
        if (!$cookies.IsLogged) {
            alert('You are not logged on!');
            $location.url('/');
        } else {
            users.getUserById($cookies.userId)
                .success(function (data) {
                    $scope.currUsername = data[0].username;
                    $scope.authMessage = 'You are successfully logged on as ' + data[0].username;
                });
        }
        $scope.toggleLeft = buildToggler('left');
        function buildToggler(navID) {
            var debounceFn = $mdUtil.debounce(function () {
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            }, 300);
            return debounceFn;
        }
    }])
    .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function () {
            $mdSidenav('left').close()
                .then(function () {
                    $log.debug("close LEFT is done");
                });
        };
    });

function registrationController($scope, $mdDialog, $location, $rootScope, users) {
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
                    $cookies.userId = data[0]._id;
                    $cookies.username = data[0].username;
                    $location.url('/' + data[0].username);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        }
    }
}

function logInController($scope, $mdDialog, $http, $location, $rootScope, $cookies, users) {
    $scope.formData = {};
    //$http.delete('clearAll');
    $scope.close = function () {
        $mdDialog.hide();
    };
    $scope.logIn = function () {
        users.getUser($scope.formData)
            .success(function (data) {
                $mdDialog.hide();
                $cookies.IsLogged = true;
                $cookies.userId = data[0]._id;
                $cookies.username = data[0].username;
                $location.url('/' + data[0].username);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    }
}