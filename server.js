const express = require('express');
const exphbs = require('express-handlebars');
const passport = require('passport');
const mongoose = require('mongoose');
assert = require("assert");
const router = require('./routes/index.js')
const User = require('./model/User');

const GithubStrategy = require('passport-github').Strategy;
const config = require('./oauth');


require('dotenv').config()

// initialize the express app
const app = express();

// set up expressSession
const expressSession = require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
});

// set up mongoose for mongodb
mongoose.connect(
    process.env.MONGO_URL,
    {
      useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false,
    },
    function(err, db) {
      assert.equal(null, err);
      console.log("Connected successfully to database");
  
      // db.close(); turn on for testing
    }
);
mongoose.connection.on("error", console.error.bind(console, "MongoDB connection Error:"));
mongoose.set("debug", true);

// set up template engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// use express.json and express.urlencoded methods to parse the request body
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// use expressionSession middleware to save the session cookie
app.use(expressSession);

// set up template engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

/*passport setup */
//initialize passport and its session authentication
app.use(passport.initialize());
app.use(passport.session());


/* Passport Local Authentication */

// make passport use local strategy. The createStrategy() is a helper method that comes from passport-local-mongoose
passport.use(User.createStrategy());

// sserialize and deserialize user instance
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


passport.use(new GithubStrategy({
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
  ));


// mount routes on express
app.use(router)


// route to catch all requests on endpoints not defined
app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Resource not found.',
      possibleCauses: [
        'Maybe you got the URL wrong',
        '...',
      ],
    });
  });
  
  // catch 404 and forward to error handler
  
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    err.message = 'Sorry, this path doesn\'t exit';
    next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    res.status(500).json({
      err,
    });
  });
  

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port}`));