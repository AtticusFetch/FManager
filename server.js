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


app.delete('/clearAllExpenses', function (req, res) {
    Expense.remove(function (err, expense) {
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

app.get('/parser', function (req, res) {
    res.sendFile('public/templates/diplom.html', {root: __dirname});
});

app.post('/api/parser/', function (req, res) {
    console.log(req.body.url);
    var resultObj = {};
    resultObj.topics = [];
    var AYLIENTextAPI = require('aylien_textapi');
    resultObj.str = "";
    var promise = new Promise(
      function(resolve, reject) {
        request({uri:req.body.url,method:'GET',encoding:'binary'},
        function (err, res, body) {
          var $=cheerio.load(
            iconv.encode(
              iconv.decode(
                new Buffer(body,'binary'),
                'windows-1251'),
                'windows-1251')
              );
              // console.log($("meta[name='description']")['0'].attribs.content);
              if ($("meta[name='description']")['0']) {
                resultObj.str += $("meta[name='description']")['0'].attribs.content;
              }
              if ($("meta[name='keywords']")['0']) {
                resultObj.str += " " + $("meta[name='keywords']")['0'].attribs.content;
              }
              // res.resultStr = resultStr;
              // res.json(resultObj);
              // console.log(resultStr);
              resolve(resultObj);
            }
          );

      }
    )
    promise.then( function(val){
      var textapi = new AYLIENTextAPI({
        application_id: "a9a71d3d",
        application_key: "39f1d1da917f6749eab7304dc91220d0"
      });
      var promise = new Promise(
        function(resolve, reject) {
          textapi.classifyByTaxonomy({
            'text': val.str,
            'taxonomy': 'iab-qag'
          }, function(error, response) {
            if (error === null) {
              response['categories'].forEach(function(c) {
                // console.log(c.label);
                val.topics.push(c.label);
                // console.log(val);
              });
              resolve(val);
            }
          });
        });
        promise.then(function(val){
          res.send(val);
          res.end();
        })
    });
    // promise.then(function(val){
    //   val.then(function(val){
    //   })
    // });

});

app.delete('/clearAll', function (req, res) {
    User.remove(function (err, user) {
        User.find(function(err, users) {
            console.log(users);
        })
    });
});

// Parser

var request = require('request'),
    cheerio = require('cheerio'),
    iconv = require('iconv-lite'),
    jsonfile = require('jsonfile'),
    WordPOS = require('wordpos'),
    option = {
      urls: ""
    }

var file = 'json/urls.json';
jsonfile.readFile(file, function(err, obj) {
  option.urls = obj.urls;
})

app.get('/test', function (req, res) {
    var resultJson = [];
    var resultFile = 'json/result.json';
    wordpos = new WordPOS();
    var stringToWords = function(str){
      var words = str.toLowerCase().split(/\W+/);
      var returnArr = [];
      // words.forEach(function(word, i){
      //   // wordpos.isNoun(word, function(result, word){
      //   //   if (result){
      //   //     returnArr.push(word);
      //   //   }
      //   // })
      //   returnArr.push(word);
      // })
      return returnArr;
    }

    for(var i=0; i < option.urls.length; i++){
      // resultJson.push(option.urls[i]);
      request({uri:option.urls[i],method:'GET',encoding:'binary'},
      function (err, res, body) {
        var $=cheerio.load(
          iconv.encode(
            iconv.decode(
              new Buffer(body,'binary'),
              'windows-1251'),
              'windows-1251')
        );
            // console.log($("meta[name='description']")['0'].attribs.content);

        resultJson.push(stringToWords($("meta[name='description']")['0'].attribs.content));
      });
    }
    setTimeout(function(){
      jsonfile.writeFile(resultFile, resultJson, function (err) {
        console.error(err)
      })
      // console.log(resultJson);
    }, 4000)
});


app.listen(8000);
console.log("App listening on port 8000");
