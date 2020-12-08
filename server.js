const express = require('express');
const exphbs = require('express-handlebars');
const passport = require('passport');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

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


// use express.json and express.urlencoded methods to parse the request body
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// use expressionSession middleware to save the session cookie
app.use(expressSession);

/*passport setup */
//initialize passport and its session authentication
app.use(passport.initialize());
app.use(passport.session());

// set up template engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port}`));