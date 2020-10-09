var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
var stock = require("./data/stock.json");

var app = express();

var port = process.env.npm_package_config_myPort || 3000;

// body-parser middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
    res.render('index', { title: 'Checkout' });
});

app.post('/search', function(req, res){
    var found = false;

    for (item in stock) {
        if (stock[item].upc == req.body.value) {
            found = true;
            res.json({found: 1, upc: stock[item].upc, name: stock[item].name, price: stock[item].price});
            break;
        }
    }
    if (!found) res.json({found: 0, upc: 0, name: "", price: 0});
 });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var server = app.listen(port, () => {
    console.log("Started on PORT " + port);
});

module.exports = {
    app: app, 
    server: server
};
