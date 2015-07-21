var AnalyticsControllers = angular.module('AnalyticsControllers', ['ngMaterial', 'ngCookies']);

AnalyticsControllers.controller('analyticsController', ['$routeParams', '$scope', '$rootScope', '$location', '$timeout', '$mdSidenav', '$mdUtil', '$log', '$cookies', 'expenses',
    function ($routeParams, $scope, $rootScope, $location, $timeout, $mdSidenav, $mdUtil, $log, $cookies, expenses) {
        $scope.authMessage = '';
        $scope.selected = [];
        $scope.categories = expenses.getCategories();
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
            pointHitDetectionRadius: 2,

            //Boolean - Whether to show a stroke for datasets
            datasetStroke: true,

            //Number - Pixel width of dataset stroke
            datasetStrokeWidth: 2,

            //Boolean - Whether to fill the dataset with a colour
            datasetFill: true,

            //String - A legend template
            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

        };

        var dataBuilder = function (categories) {
            var labels = [];
            if (!categories) {
                categories = expenses.getCategories()
            }
            var data = {
                cost: [],
                category: []
            };
            var datasets = [];
            var dataset = {
                label: "Monthly report",
                fillColor: "rgba(0,0,220,0.3)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: []
            };

            var getDaysLabels = function (usersExpenses){
                usersExpenses.forEach(function (expense) {
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
                return labels;
            };
            expenses.getExpensesByUserId($cookies.userId)
                .success(function (usersExpenses) {
                    $scope.expenses = usersExpenses;
                    labels = getDaysLabels(usersExpenses);
                    for (var currentCategory = 0; currentCategory < categories.length; currentCategory++) {
                        dataset = {
                            label: "Monthly report",
                            fillColor: "rgba(0,0,220,0.3)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: []
                        };
                        labels.forEach(function (day) {
                            $scope.expenses.forEach(function (expense) {
                                var expenseDay = parseInt(expense.date.slice(8, 10));
                                var expenseMonth = parseInt(expense.date.slice(5, 7));
                                var expenseCategory = expense.category;
                                if (expenseMonth == 3 && expenseDay == day && expenseCategory == categories[currentCategory]) {
                                    data.cost[expenseDay] = parseFloat(expense.cost)
                                }
                            });
                        });
                        for (var i = 1; i < labels.length; i++) {
                            if (data.cost[i]) {
                                dataset.data.push(data.cost[i]);
                            } else {
                                dataset.data.push(0);
                            }
                        }
                        var dailyExpenses = [];
                        data.cost.forEach(function (dayExpense) {
                            if (!dailyExpenses[dayExpense.day]) {
                                dailyExpenses[dayExpense.day] = 0;
                                dailyExpenses[dayExpense.day] += dayExpense.cost;
                            } else {
                                dailyExpenses[dayExpense.day] += dayExpense.cost;
                            }
                        });

                        dataset.fillColor = "rgba(" + chance.natural({min: 0, max: 220}) + "," + chance.natural({
                            min: 0,
                            max: 220
                        }) + "," + chance.natural({min: 0, max: 220}) + ",0.3)";
                        datasets.push(dataset);
                    }
                    var newObj = {
                        labels: labels,
                        datasets: datasets
                    };
                    var ctx = document.getElementById("myChart").getContext("2d");
                    new Chart(ctx).Line(newObj, chartOptions);
                });
        };
        dataBuilder();
        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
                if (list.length == 0) {
                    dataBuilder();
                } else {
                    dataBuilder(list);
                }
            }
            else {
                list.push(item);
                dataBuilder(list);
            }
        };
    }]);