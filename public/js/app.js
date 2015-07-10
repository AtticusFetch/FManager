/**
 * Created by Ivan_Iankovskyi on 7/8/2015.
 */
'use strict';

var FManager = angular.module('FManager', ['ngRoute', 'FManagerControllers', 'registrationServices', 'ngMaterial', 'ngCookies'])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: '../templates/main.html',
                    controller: 'mainPageController'
                }).
                when('/:username', {
                    templateUrl: '../templates/mainLogged.html',
                    controller: 'mainPageLoggedController'
                })
        }]);