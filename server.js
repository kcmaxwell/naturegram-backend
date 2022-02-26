const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const passport = require('passport');
const passportLocal = require('passport-local');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const User = require('./models/user');

const app = express();

require('dotenv').config();

// mongoose setup
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
},
() => {
    console.log('Mongoose is connected');
}
);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({
    origin: process.env.REACT_APP_URL,
    credentials: true,
}));

app.use(session({
    secret: process.env.SESSION_SECRET_ARRAY,
    cookie: {
        maxAge: 1000 * 60 * 60 *24 * 365,
        sameSite: 'strict',
    },
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,
        touchAfter: 24 * 3600,
        ttl: 14 * 24 * 60 * 60,
        autoRemove: 'native'
    }),
}));

app.use(cookieParser(process.env.SESSION_SECRET_ARRAY));

require('./config/passportConfig')(passport);
app.use(passport.initialize());
app.use(passport.session());

// routes
app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
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
});
app.post('/register', (req, res) => {
    User.findOne({
        username: req.body.username
    }, async (err, doc) => {
        if (err) throw err;
        if (doc) res.send('User already exists');
        if (!doc) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const newUser = new User({
                username: req.body.username,
                password: hashedPassword
            });
            await newUser.save();
            res.send('User created');
        }
    });
});
app.get('/user', (req, res) => {
    if (!req.session.loggedIn) {
        console.log("No user session exists");
        res.send(null);
    } else {
        res.send(req.user); // req.user stores the entire user that has been authenticated inside of it
    }
});
app.post('/logout', (req, res) => {
    req.logout();
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        } else {
            res.send('Logged out');
        }
    });
});

app.listen(process.env.PORT || 3001, () => {
    console.log('Server has started');
});