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
            $location.url('#/' + $cookies.username);
        }
    }]);

FManagerControllers.controller('mainPageLoggedController', ['$routeParams', '$scope', '$rootScope', '$location', '$timeout', '$mdSidenav', '$mdUtil', '$cookies',
    function ($routeParams, $scope, $rootScope, $location, $timeout, $mdSidenav, $mdUtil, $cookies) {
        $scope.authMessage = '';
        if (!$cookies.IsLogged) {
            alert('You are not logged on!');
            $location.url('#/');
        } else {
            $scope.currUsername = $cookies.username;
            $scope.authMessage = 'You are successfully logged on as ' + $scope.currUsername;
        }
        $scope.logOut = function () {
            delete $cookies.IsLogged;
            delete $cookies.username;
            delete $cookies.email;
            delete $cookies.userId;
            $location.url('/');
        };
        $scope.toggleLeft = buildToggler('left');
        function buildToggler(navID) {
            var debounceFn = $mdUtil.debounce(function () {
                $mdSidenav(navID)
                    .toggle()
            }, 300);
            return debounceFn;
        }
    }]);

FManagerControllers.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav) {
    $scope.close = function () {
        $mdSidenav('left').close()
    };
});

FManagerControllers.controller('profileController', ['$routeParams', '$scope', '$rootScope', '$location', '$timeout', '$mdSidenav', '$mdUtil', '$log', '$cookies',
    function ($routeParams, $scope, $rootScope, $location, $timeout, $mdSidenav, $mdUtil, $log, $cookies) {
        $scope.authMessage = '';
        if (!$cookies.IsLogged) {
            alert('You are not logged on!');
            $location.url('/');
        } else {
            $scope.currUsername = $cookies.username;
            $scope.authMessage = $scope.currUsername + "'s profile page";
            $scope.currEmail = $cookies.email;
        }
        $scope.logOut = function () {
            delete $cookies.IsLogged;
            delete $cookies.username;
            delete $cookies.email;
            delete $cookies.userId;
            $location.url('/');
        };
        $scope.toggleLeft = buildToggler('left');
        function buildToggler(navID) {
            var debounceFn = $mdUtil.debounce(function () {
                $mdSidenav(navID)
                    .toggle()
            }, 300);
            return debounceFn;
        }
    }]);

FManagerControllers.controller('tablesController', ['$routeParams', '$scope', '$rootScope', '$location', '$timeout', '$mdSidenav', '$mdUtil', '$log', '$cookies', '$http', 'expenses',
    function ($routeParams, $scope, $rootScope, $location, $timeout, $mdSidenav, $mdUtil, $log, $cookies, $http, expenses) {
        $scope.authMessage = '';
        $scope.formData = {};
        $scope.clearAllExpenses = function () {
            $http.delete('/clearAllExpenses/' + $cookies.userId)
                .success(function () {
                    $scope.expenses = [];
                })
        };
        $scope.generateExpenses = function () {
            $scope.clearAllExpenses();
            var categories = ['Food', 'Lawns', 'Electronics', 'Taxes', 'Online Games', 'Gas', 'Wife'];
            var dates = [];
            var expense = {};
            for (var month = 2; month <= 5; month++) {
                for (var day = 1; day <= 30; day++) {
                    dates.push(new Date(2015, month, day, 0, 0, 0, 0))
                }
            }
            for (var dateIndex = 0; dateIndex < 3; dateIndex++) {
                for (var expensesAmount = 0; expensesAmount < 3; expensesAmount++) {
                    expense = {};
                    expense._userId = $cookies.userId;
                    expense.name = chance.string({length: 4, pool: 'abcdefghijklmnopqrstuvwxyz'});
                    expense.category = categories[chance.natural({min: 0, max: 6})];
                    expense.amount = chance.natural({min: 1, max: 6});
                    expense.cost = chance.floating({min: 0.01, max: 100, fixed: 2});
                    expense.date = dates[dateIndex];
                    $http.post('/api/newExpense', expense)
                        .success(function () {
                            expenses.getExpensesByUserId($cookies.userId)
                                .success(function (data) {
                                    $scope.expenses = data;
                                });
                        })
                }
            }
        };
        expenses.getExpensesByUserId($cookies.userId)
            .success(function (data) {
                $scope.expenses = data;
            });
        $scope.removeExpense = function (expenseId) {
            expenses.remove(expenseId)
                .success(function () {
                    $scope.expenses.forEach(function (expense) {
                        if (expense._id == expenseId)
                            $scope.expenses.splice($scope.expenses.indexOf(expense),1);
                    });
                });
        };
        if (!$cookies.IsLogged) {
            alert('You are not logged on!');
            $location.url('/');
        } else {
            $scope.currUsername = $cookies.username;
            $scope.authMessage = $scope.currUsername + "'s tables page";
        }
        $scope.submitExpense = function () {
            $scope.formData._userId = $cookies.userId;
            expenses.addExpense($scope.formData)
                .success(function (data) {
                    expenses.getExpensesByUserId($cookies.userId)
                        .success(function (data) {
                            $scope.expenses = data;
                        });
                })
        };
        $scope.logOut = function () {
            delete $cookies.IsLogged;
            delete $cookies.username;
            delete $cookies.email;
            delete $cookies.userId;
            $location.url('/');
        };
        $scope.toggleLeft = buildToggler('left');
        function buildToggler(navID) {
            var debounceFn = $mdUtil.debounce(function () {
                $mdSidenav(navID)
                    .toggle()
            }, 300);
            return debounceFn;
        }
    }]);

FManagerControllers.controller('analyticsController', ['$routeParams', '$scope', '$rootScope', '$location', '$timeout', '$mdSidenav', '$mdUtil', '$log', '$cookies',
    function ($routeParams, $scope, $rootScope, $location, $timeout, $mdSidenav, $mdUtil, $log, $cookies) {
        $scope.authMessage = '';
        if (!$cookies.IsLogged) {
            alert('You are not logged on!');
            $location.url('/');
        } else {
            $scope.currUsername = $cookies.username;
            $scope.authMessage = $scope.currUsername + "'s analytics page";
        }
        $scope.logOut = function () {
            delete $cookies.IsLogged;
            delete $cookies.username;
            delete $cookies.email;
            delete $cookies.userId;
            $location.url('/');
        };
        $scope.toggleLeft = buildToggler('left');
        function buildToggler(navID) {
            var debounceFn = $mdUtil.debounce(function () {
                $mdSidenav(navID)
                    .toggle()
            }, 300);
            return debounceFn;
        }
    }]);

function registrationController($scope, $mdDialog, $location, $cookies, users) {
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
                    $cookies.username = data[0].username;
                    $cookies.email = data[0].email;
                    $cookies.userId = data[0]._id;
                    $location.url('/' + data[0].username);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        }
    }
}

function logInController($scope, $mdDialog, $location, $cookies, $http, users) {
    $scope.formData = {};
    //$http.delete('clearAll');
    //$http.get('/api/getAllUsers');
    //$http.get('/api/getAllExpenses');
    $scope.close = function () {
        $mdDialog.hide();
    };
    $scope.logIn = function () {
        users.getUser($scope.formData)
            .success(function (data) {
                $mdDialog.hide();
                $cookies.IsLogged = true;
                $cookies.username = data[0].username;
                $cookies.email = data[0].email;
                $cookies.userId = data[0]._id;
                $location.url('/' + data[0].username);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    }
}