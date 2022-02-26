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
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,
        touchAfter: 24 * 3600,
        ttl: 14 * 24 * 60 * 60,
        autoRemove: 'native'
    }),
}));

app.use(cookieParser(process.env.SESSION_SECRET_ARRAY));

require('./passportConfig')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.listen(process.env.PORT || 3001, () => {
    console.log('Server has started');
});