/**
 * Created by Ivan_Iankovskyi on 7/8/2015.
 */
'use strict';

var FManagerControllers = angular.module('FManagerControllers', ['ngMaterial']);

FManagerControllers.controller('mainPageController', ['$http', '$scope', '$rootScope', '$mdDialog', '$location', '$cacheFactory', 'users',
    function ($http, $scope, $rootScope, $mdDialog, $location, $cacheFactory, users) {
        if (!$rootScope.cache) {
            $rootScope.cache = $cacheFactory('authInfo');
        }
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
        $http.get('/api/mainPage');
    }]);

FManagerControllers.controller('mainPageLoggedController', ['$routeParams', '$scope', '$rootScope', '$location', 'users', function ($routeParams, $scope, $rootScope, $location, users) {
    $scope.authMessage = '';
    if (!$rootScope.cache.get('IsLogged')) {
        alert('You are not logged on!');
        $location.url('/');
    } else {
        users.getUserById($rootScope.cache.get('UserId'))
            .success(function (data) {
                console.log(data[0].username);
                $scope.authMessage = 'You are successfully logged on as ' + data[0].username;
            });
    }
}]);

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
                    $rootScope.cache.put('IsLogged', 'true');
                    $rootScope.cache.put('UserId', data[0]._id);
                    $location.url('/' + data[0].username);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        }
    }
}

function logInController($scope, $mdDialog, $http, $location, $rootScope, users) {
    $scope.formData = {};
    //$http.delete('clearAll');
    $scope.close = function () {
        $mdDialog.hide();
    };
    $scope.logIn = function () {
        users.getUser($scope.formData)
            .success(function (data) {
                $mdDialog.hide();
                $rootScope.cache.put('IsLogged', 'true');
                $rootScope.cache.put('UserId', data[0]._id);
                $location.url('/' + data[0].username);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    }
}