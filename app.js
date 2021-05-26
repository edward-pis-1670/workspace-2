require('dotenv').config();
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

// require passport
var session = require('express-session');
var passport = require('passport');

// require routes
var routes = require('./routes/index');
var authentication = require('./routes/apis/authentication');
var genreApi = require('./routes/apis/genres');
var userApi = require('./routes/apis/users');
var resourceApi = require('./routes/apis/resources')
var courseApi = require('./routes/apis/course')
var coursesApi = require('./routes/apis/courses')
var adminApi = require('./routes/apis/admin')
// var user = require('./routes/users');

// var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//passport setup
app.use(session({
  secret: "secret",
  saveUninitialized: true,
  resave: true
}))
app.use(passport.initialize());
app.use(passport.session());

//routes setup
app.use('/authentication', authentication)
app.use('/api/genres', genreApi)
app.use('/api/user', userApi)
app.use('/api/resource', resourceApi)
app.use('/api/course', courseApi)
app.use('/api/courses', coursesApi)
app.use('/api/admin', adminApi)
app.use('/', routes)

//connect mongodb
var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('on open connect');
});

mongoose.connect(process.env.MONGODB_URL);






module.exports = app;
