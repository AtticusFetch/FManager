var TablesControllers = angular.module('TablesControllers', ['ngMaterial', 'ngCookies']);

TablesControllers.controller('tablesController', ['$routeParams', '$scope', '$rootScope', '$location', '$timeout', '$mdSidenav', '$mdUtil', '$log', '$cookies', '$http', 'expenses',
    function ($routeParams, $scope, $rootScope, $location, $timeout, $mdSidenav, $mdUtil, $log, $cookies, $http, expenses) {
        $scope.authMessage = '';
        $scope.formData = {};
        $scope.clearAllExpenses = function () {
            $http.delete('/clearAllExpenses/' + $cookies.userId);
            for (var i = 0; i < $scope.expenses.length; i++) {
                (function () {
                    setTimeout(function (i) {
                        return $scope.expenses.splice($scope.expenses.indexOf($scope.expenses[i]), 1)
                    }, 1)
                })();
            }
        };
        $scope.generateExpenses = function () {
            $scope.clearAllExpenses();
            var categories = expenses.getCategories();
            var dates = [];
            var startingMonth = 2;
            var lastMonth = 3;

            for (var month = startingMonth; month <= lastMonth; month++) {
                for (var day = 1; day <= 30; day++) {
                    for (var hour = 0; hour < 24; hour += 8) {
                        dates.push(new Date(2015, month, day, hour, randomNumber(0, 59), randomNumber(0, 59)));
                    }
                }
            }
            expenseGenerator(categories, dates);
            expenses.getExpensesByUserId($cookies.userId)
                .success(function (data) {
                    $scope.expenses = data;
                    $('#load').addClass('invisible');
                });
        };

        var randomNumber = function (min, max) {
            var rNum1;
            var rNum2;
            var coin = chance.natural({min: 0, max: 1});
            rNum1 = (Math.floor(Math.random() * (max - min + 1)) + min);
            rNum2 = chance.natural({min: min, max: max});
            if (coin) {
                return rNum1;
            }
            return rNum2;
        };

        var expenseGenerator = function (categories, dates) {
            $('#load').removeClass('invisible');
            for (var dateIndex = 0; dateIndex < dates.length; dateIndex++) {
                var freshExpense = expenseFactory(categories, dates[dateIndex]);
                $http.post('/api/newExpense', freshExpense)
                    .success(function (data) {

                    });

            }
        };

        var expenseFactory = function (categories, date) {
            var expense = {};
            expense._userId = $cookies.userId;
            expense.name = chance.string({length: 4, pool: 'abcdefghijklmnopqrstuvwxyz'});
            expense.category = categories[chance.natural({min: 0, max: 6})];
            expense.amount = chance.natural({min: 1, max: 6});
            expense.cost = chance.floating({min: 0.01, max: 100, fixed: 2});
            expense.date = date;

            return expense;
        };
        $('#load').removeClass('invisible');
        expenses.getExpensesByUserId($cookies.userId)
            .success(function (data) {
                $scope.expenses = data;
                $('#load').addClass('invisible');
            });
        $scope.removeExpense = function (expenseId) {
            expenses.remove(expenseId)
                .success(function () {
                    $scope.expenses.forEach(function (expense) {
                        if (expense._id == expenseId)
                            $scope.expenses.splice($scope.expenses.indexOf(expense), 1);
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
            $scope.formData.date.setDate(parseInt($scope.formData.date.getDate()) + 1);
            expenses.addExpense($scope.formData)
                .success(function (data) {
                    console.log(data);
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