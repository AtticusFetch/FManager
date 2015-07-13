/**
 * Created by Ivan_Iankovskyi on 7/8/2015.
 */
'use strict';

var FManager = angular.module('FManager', ['ngRoute', 'FManagerControllers', 'registrationServices', 'expenseServices', 'ngMaterial', 'ngCookies'])
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
                }).
                when('/:username/profile', {
                    templateUrl: '../templates/profile.html',
                    controller: 'profileController'
                }).
                when('/:username/tables', {
                    templateUrl: '../templates/tables.html',
                    controller: 'tablesController'
                }).
                when('/:username/analytics', {
                    templateUrl: '../templates/analytics.html',
                    controller: 'analyticsController'
                })
        }]);