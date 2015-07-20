/**
 * Created by Ivan_Iankovskyi on 7/8/2015.
 */
'use strict';

var FManagerControllers = angular.module('FManagerControllers', ['ngMaterial', 'ngCookies']);

FManagerControllers.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav) {
    $scope.close = function () {
        $mdSidenav('left').close()
    };
});