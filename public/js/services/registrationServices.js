/**
 * Created by Ivan_Iankovskyi on 7/9/2015.
 */
'use strict';

var registrationServices = angular.module('registrationServices', []);

registrationServices.factory('users', ['$http', function ($http) {
    return {
        addUser: function (formData) {
            return $http.post('/api/newUser', formData);
        },

        getUser: function (formData) {
            return $http.get('/api/getUser/'+formData.username+'&'+formData.password);
        },

        getUserById: function (userId) {
            return $http.get('/api/getUserById/'+userId);
        }
    }
}]);