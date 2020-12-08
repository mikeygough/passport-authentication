const express = require('express');
const router = express.Router();
const connectEnsureLogin = require('connect-ensure-login');
const passport = require('passport');


router.post('/login', (req, res, next) => {

    // Authenticate with local strategy
    passport.authenticate('local',
    (err, user, info) => {
      if (err) {
        return next(err);
      }
  
      if (!user) {
        return res.redirect('/login?info=' + info);
      }
  
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
  
        return res.redirect('/');
      });
  
    })(req, res, next);
  });
// Route that renders the login page
// When you visit the http://localhost:3000/login, you will see "Login Page"
router.get('/login', (req, res) => {
    res.render('login');
});

// connectEnsureLogin acting as route guard to make sure the routes can't be accessed if not logged in
router.get('/', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    res.render('index', {msg: 'You are Welcome Here'});
});

router.get('/user', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    res.render('user', { user: req.user });
})

module.exports = router;