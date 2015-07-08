/**
 * Created by Ivan_Iankovskyi on 7/8/2015.
 */
'use strict';

var FManagerControllers = angular.module('FManagerControllers', ['ngMaterial']);

FManagerControllers.controller('mainPageController', ['$http','$scope','$mdDialog', function ($http,$scope,$mdDialog) {
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

function registrationController ($scope,$mdDialog) {
    $scope.submit = function () {
        $mdDialog.hide();
    }
}

function logInController ($scope,$mdDialog) {
    $scope.submit = function () {
        $mdDialog.hide();
    }
}