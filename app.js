var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
var stock = require("./data/stock.json");

var app = express();

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
    console.log("we're here at least...")
    console.log(req.body.value);
    var found = false;

    for (item in stock) {
        console.log(stock[item].upc);
        if (stock[item].upc == req.body.value) {
            console.log("found");
            found = true;
            res.json({found: 1, upc: stock[item].upc, name: stock[item].name, price: stock[item].price});
            break;
        }
    }
    if (!found) res.json({found: 0, name: "", price: 0});
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

app.listen(3000, () => {
    console.log("Started on PORT 3000");
});

module.exports = app;