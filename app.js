// upload programming libraries
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const session = require('express-session');
var logger = require('morgan');
const { fdatasync } = require('fs');
const MongoStore = require('connect-mongo')

// create an express aplication, which is exported at the end of the doc.
var app = express();

// create a connection with the data base
require('./models/connectMongoose');

// view engine setup
app.set('views', path.join(__dirname, 'views')); // path.join __dirname (/unix and \windows for forlders)
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);
app.locals.title = 'ExpressPOP';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // Middleware  
app.use(express.static(path.join(__dirname, 'public'))); // public is the only folder accesible for downloads

//API ROUTES
app.use('/api/anuncios', require('./routes/api/anuncios.js'));

// i18n SETUP
const i18n = require('./lib/i18n.js');
app.use(i18n.init);

// website sessions Middleware
app.use(session({
  name: 'nodeapi-session',
  secret: '6098fe0f16a50b4c39d77ed4',
  saveUninitialized: true,
  resave: false,
  cookie: {
    secure: process.env.NODE_ENV !== 'development', // solo se envian al servidor cuando la petición es HTTPS
    maxAge: 1000 * 60 * 60 * 24 * 2 // 2 días de inactividad
  },
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost/cursonode' })
}));



//WebSite ROUTES
app.use('/prueba', function(req, res, next){
  console.log('recibo una petición a ', req.originalUrl); 
  next();
});

app.use('/', require('./routes/index')); // Main page
app.use('/imagenes', require('./routes/imagenes')); // Images of the anuncios
app.use('/installdb', require('./public/javascripts/installdb')); // DB advertisments initialization
//app.use('./initdbusers', require('./public/javascripts/initdbusers.js')); // DB users initialization
app.use('/change-locale', require('./routes/change-locale.js')); // Languague selection routes - PLACE ALWAYS AFTER cookieparser
app.use('/thumbnail', require('./routes/thumbnail.js')); // Thumbnail creator
app.use('/nuevoanuncio', require('./routes/nuevoanuncio.js'));
app.get('/login', require('./controllers/loginController.js').index);
app.post('/login', require('./controllers/loginController.js').post);
app.use('/users', require('./routes/users'));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler - only error handler has err param
app.use(function(err, req, res, next) {
  // Validation error?
  if (err.array) { // If is array method it is an validation error
    const errorInfo = err.array({ onlyFirstError: true })[0]; //onlyFirstError is an array method, only throws the first error, then we call the position [0]
    err.message = `Not valid - ${errorInfo.param} ${errorInfo.msg}`;
    err.status = 422; // 422 data failure. Without err.status it returns 500 (server error)
  }

  res.status(err.status || 500);

  // If it is an API request we show the error message and return, we do not need to charge a views, views are only for browser request
  if (isAPIRequest(req)) { 
    res.json({ error: err.message });
    return;
  };

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

// Create a function that check if it is an API request
function isAPIRequest (req) {
  return req.originalUrl.indexOf('/api/') === 0; // IndexOf returns the position of the string searched, if there is the string it returns 0
};

module.exports = app;
