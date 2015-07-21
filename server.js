/**
 * Created by Ivan_Iankovskyi on 7/8/2015.
 */
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

mongoose.connect('mongodb://admin:admin@apollo.modulusmongo.net:27017/e2xaTuge');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());

var User = mongoose.model('User', {
    username: String,
    email: String,
    password: String
});

var Expense = mongoose.model('Expense', {
    _userId: String,
    date: Date,
    category: String,
    name: String,
    amount: String,
    cost: String
});

app.post('/api/newExpense', function (req, res) {
    Expense.create({
        _userId: req.body._userId,
        date: req.body.date || new Date(),
        category: req.body.category,
        name: req.body.name,
        amount: req.body.amount || 1,
        cost: req.body.cost,
        done: false
    }, function (err, expense) {
        if (err)
            res.send(err);

        Expense.find({_id: expense._id}, function (err, expense) {
            if (err)
                res.send(err);
            console.log(expense);
            res.json(expense);
        })
    })
});

app.post('/api/pushDump', function (req, res) {
    req.body.forEach(function (expense) {
        Expense.create({
            _userId: expense._userId,
            date: expense.date || new Date(),
            category: expense.category,
            name: expense.name,
            amount: expense.amount || 1,
            cost: expense.cost,
            done: false
        }, function (err, expense) {
            if (err)
            res.send(err)
        })
    });
    Expense.find({_userId: req.body[0].userId}, function (err, expenses) {
        if (err)
            res.send(err);
        res.json(expenses);
    })
});

app.get('/api/getExpenses/:userId', function (req, res) {
    Expense.find({_userId: req.params.userId}, function (err, expenses) {
        if (err)
            res.send(err);
        res.json(expenses);
    })
});

app.get('/api/getAllExpenses', function (req, res) {
    Expense.find(function (err, expenses) {
        console.log(expenses);
    })
});

app.delete('/api/removeExpense/:expenseId', function (req, res) {
    Expense.remove({_id: req.params.expenseId}, function (err, expense) {
        if (err)
            res.send(err);
        res.json(expense);
    });
});


app.delete('/clearAllExpenses/:userId', function (req, res) {
    Expense.remove({_userId: req.params.userId}, function (err, expense) {
        if (err)
            res.send(err);
        res.json(expense);
    });
});

app.get('/api/getAllUsers', function (req, res) {
    User.find(function (err, users) {
        console.log(users);
    })
});

app.get('/api/getUserById/:userId', function (req, res) {
    User.find({_id: req.params.userId}, function (err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });
});

app.get('/api/getUser/:username&:password', function (req, res) {
    User.find({username: req.params.username, password: req.params.password}, function (err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });
});

app.post('/api/newUser', function (req, res) {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        done: false
    }, function (err, user) {
        if (err)
            res.send(err);

        User.find({_id: user._id}, function (err, user) {
            if (err)
                res.send(err);
            console.log(user);
            res.json(user);

        })
    })
});

app.get('/api/mainPage', function (req, res) {
    res.sendFile('public/index.html', {root: __dirname});
});

app.delete('/clearAll', function (req, res) {
    User.remove(function (err, user) {
        User.find(function(err, users) {
            console.log(users);
        })
    });
});

app.listen(8000);
console.log("App listening on port 8000");