const passport = require('passport');

const User = require('../models/user');

exports.login = function (req, res, next) {
    console.log('About to authenticate');

    passport.authenticate('local', (err, user, info) => {
        console.log('Started authenticate');

        if (err) throw err;
        if (!user) {
             res.send("No user exists");
        } else {
            req.login(user, err => {
                if (err) throw err;
                req.session.loggedIn = true;
                req.session.username = user.username;
                res.send('Successfully authenticated');
                console.log(req.user);
            });
        }
    })(req, res, next);
};

exports.logout = function (req, res) {
    req.logout();
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        } else {
            res.send('Logged out');
        }
    });
};

exports.register = function (req, res) {
    User.findOne({
        username: req.body.username
    }, async (err, doc) => {
        if (err) throw err;
        if (doc) res.send('User already exists');
        if (!doc) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const newUser = new User({
                username: req.body.username,
                password: hashedPassword,
                first_name: req.body.first_name,
                last_name: req.body.last_name
            });
            await newUser.save();
            res.send('User created');
        }
    });
};

exports.get_user = function (req, res) {
    if (!req.session.loggedIn) {
        console.log("No user session exists");
        res.send(null);
    } else {
        res.send(req.user); // req.user stores the entire user that has been authenticated inside of it
    }
};