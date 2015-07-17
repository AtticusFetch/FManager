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
            var categories = ['Food', 'Lawns', 'Electronics', 'Taxes', 'Online Games', 'Gas', 'Wife'];
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
            $scope.formData.date.setDate(parseInt($scope.formData.date.getDate())+1);
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

FManagerControllers.controller('analyticsController', ['$routeParams', '$scope', '$rootScope', '$location', '$timeout', '$mdSidenav', '$mdUtil', '$log', '$cookies', 'expenses',
    function ($routeParams, $scope, $rootScope, $location, $timeout, $mdSidenav, $mdUtil, $log, $cookies, expenses) {
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

        var chartOptions = {

            ///Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines: true,

            //String - Colour of the grid lines
            scaleGridLineColor: "rgba(0,0,0,.05)",

            //Number - Width of the grid lines
            scaleGridLineWidth: 1,

            //Boolean - Whether to show horizontal lines (except X axis)
            scaleShowHorizontalLines: true,

            //Boolean - Whether to show vertical lines (except Y axis)
            scaleShowVerticalLines: true,

            //Boolean - Whether the line is curved between points
            bezierCurve: true,

            //Number - Tension of the bezier curve between points
            bezierCurveTension: 0.4,

            //Boolean - Whether to show a dot for each point
            pointDot: true,

            //Number - Radius of each point dot in pixels
            pointDotRadius: 4,

            //Number - Pixel width of point dot stroke
            pointDotStrokeWidth: 1,

            //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
            pointHitDetectionRadius: 20,

            //Boolean - Whether to show a stroke for datasets
            datasetStroke: true,

            //Number - Pixel width of dataset stroke
            datasetStrokeWidth: 2,

            //Boolean - Whether to fill the dataset with a colour
            datasetFill: true,

            //String - A legend template
            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

        };

        var dataBuilder = function () {
            var labels = [];
            var data = {
                cost: [],
                category: []
            };
            var datasets = [];
            var dataset = {
                label: "Monthly report",
                fillColor: "rgba(0,0,220,0.5)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: []
            };
            expenses.getExpensesByUserId($cookies.userId)
                .success(function (expenses) {
                    $scope.expenses = expenses;
                    expenses.forEach(function (expense) {
                        if (labels.indexOf(parseInt(expense.date.slice(8, 10))) == -1) {
                            labels.push(parseInt(expense.date.slice(8, 10)));
                        }
                        labels.sort(function (a, b) {
                            if (a < b) {
                                return -1;
                            }
                            if (a > b) {
                                return 1;
                            }
                            return 0;
                        });
                    });

                    labels.forEach(function (day) {
                        $scope.expenses.forEach(function (expense) {
                            var expenseDay = parseInt(expense.date.slice(8, 10));
                            var expenseMonth = parseInt(expense.date.slice(5, 7));
                            if (expenseMonth == 3) {
                                if (expenseDay == day) {
                                    data.cost.push({day: day, cost: parseFloat(expense.cost)})
                                }
                            }
                        });
                    });
                    var dailyExpenses = [];
                    data.cost.forEach(function(dayExpense) {
                        if (!dailyExpenses[dayExpense.day]) {
                            dailyExpenses[dayExpense.day] = 0;
                            dailyExpenses[dayExpense.day] += dayExpense.cost;
                        } else {
                            dailyExpenses[dayExpense.day] += dayExpense.cost;
                        }
                    });
                    dailyExpenses.forEach(function (expense) {
                       dataset.data.push(expense);
                    });
                    datasets.push(dataset);
                    var newObj = {
                        labels: labels,
                        datasets: datasets
                    };
                    var ctx = document.getElementById("myChart").getContext("2d");
                    new Chart(ctx).Line(newObj, chartOptions);
                });
        };
        dataBuilder();

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