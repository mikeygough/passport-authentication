var express = require('express');
var passport = require('passport');
const exphbs = require('express-handlebars');
const router = require('./routes/index.js');
const LocalStrategy = require('passport-local').Strategy;
const GithubStrategy = require('passport-github').Strategy;
var db = require('./model/index');

require('dotenv').config();

passport.use(
  new LocalStrategy(function (username, password, cb) {
    db.findByUsername(username, (err, user) => {
      if (err) {
        return cb(err);
      }
      if (!user) {
        return cb(null, false);
      }
      if (user.password != password) {
        return cb(null, false);
      }
      return cb(null, user);
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser((id, cb) => {
  db.findById(id, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

/* Use application-level middleware for common functionality, including parsing, and session handling.*/

// use express.json and express.urlencoded methods to parse the request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use expressionSession middleware to save the session cookie
const expressSession = require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
});
app.use(expressSession);

app.use(passport.initialize());
app.use(passport.session());

// use app middleware to mount routes to express
app.use(router);

/* Error Handling */
// route to catch all requests on endpoints not defined
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found.',
    possibleCauses: ['Maybe you got the URL wrong', '...'],
  });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(500).json({
    err,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port}`));
