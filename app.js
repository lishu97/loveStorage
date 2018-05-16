'use strict';
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var preLogMid = require('./middlewares/log').preLog;
var redisOptions = require('./config/redisOptions');
var routes = require('./controller/routes');


var app = express();

// 设置模板目录  
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// redis 
app.use(session({
    store: new RedisStore(redisOptions),
    name: 'loveStorageLogin',
    secret: 'test',
    saveUninitialized: false,
    resave: true,
    cookie: {
        maxAge: 500000000
    }
}));

app.use(preLogMid);

routes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
