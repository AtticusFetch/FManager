/**
 * Created by Ivan_Iankovskyi on 7/9/2015.
 */
'use strict';

var expenseServices = angular.module('expenseServices', []);

expenseServices.factory('expenses', ['$http', function ($http) {
    return {
        addExpense: function (formData) {
            return $http.post('/api/newExpense', formData);
        },

        getExpensesByUserId: function (userId) {
            return $http.get('/api/getExpenses/' + userId)
        },

        remove: function (expenseId) {
            return $http.delete('/api/removeExpense/' + expenseId)
        },

        getCategories: function () {
            return ['Food', 'Lawns', 'Electronics', 'Taxes', 'Online Games', 'Gas', 'Wife'];
        }
    }
}]);