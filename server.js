/**
 * Created by Ivan_Iankovskyi on 7/8/2015.
 */
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());

app.get('*', function (req, res) {
    res.sendFile('public/index.html', { root: __dirname });
});

app.listen(8000);
console.log("App listening on port 8000");