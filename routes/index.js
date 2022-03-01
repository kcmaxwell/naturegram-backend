var express = require('express');
var router = express.Router();

var authRouter = require('./auth');
var postRouter = require('./posts');
var userRouter = require('./users');

router.use('/auth', authRouter);
router.use('/post', postRouter);
router.use('/user', userRouter);

router.get('/', (req, res) => {
    res.send('Welcome to the Naturegram API');
});

module.exports = router;