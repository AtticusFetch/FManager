/**
 * Created by Ivan_Iankovskyi on 7/8/2015.
 */
'use strict';

var FManagerControllers = angular.module('FManagerControllers', []);

FManagerControllers.controller('mainPageController', ['$http', function ($http) {
    $http.get('/api/mainPage');
}]);