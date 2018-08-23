var createError = require('http-errors');
var express = require('express');
let mongoose = require('mongoose');
let morgan = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var comments = require('./routes/comments');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

let config = require('config'); // загружаем адрес базы из конфигов

//соединение с базой
mongoose.connect(config.DBHost);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//не показывать логи в тестовом окружении
if(config.util.getEnv('NODE_ENV') !== 'test') {
    //morgan для вывода логов в консоль
    app.use(morgan('combined')); //'combined' выводит логи в стиле apache
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => res.json({message: "Welcome!"}));

app.route("/comments")
    .get(comments.getComments)
    .post(comments.postComment);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
