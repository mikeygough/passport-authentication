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

            req.logIn(user, function (err) {
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

router.get('/', (req, res) => {
    res.send('Welcome');
});

router.get('/user', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    res.render('user', { user: req.user });
});

router.get('/auth/github',
    passport.authenticate('github'),
    function (req, res) { });
router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    });

module.exports = router;