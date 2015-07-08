/**
 * Created by Ivan_Iankovskyi on 7/8/2015.
 */
var FManager = angular.module('FManager', ['ngRoute', 'FManagerControllers'])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: '../templates/main.html',
                    controller: 'mainPageController'
                })
        }]);