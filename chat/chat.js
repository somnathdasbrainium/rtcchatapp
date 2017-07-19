var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

app.use(cors());

app.use(logger('dev'));
app.use(session({secret: 'ssshhhhh', resave: true, saveUninitialized: true}));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');
var routes = require('./routes/index');
var authuser = require('./routes/authuser');
var chatboard = require('./routes/chatboard');





var moment = require('moment');



////////////////////////////////////////////////////////

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/*
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
*/

 app.use(express.static(__dirname + '/public'));
/*
app.get('/', function(req, res){
  res.json({message: "Route is working"});
});
*/


app.use('/authuser', authuser);
app.use('/chatboard', chatboard);

app.get('/',(req,res) =>{
 res.sendFile(path.join(_dirname,'public/index.html'))
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;