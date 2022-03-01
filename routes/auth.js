var express = require('express');
var router = express.Router();

const authController = require('../controllers/authController');

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.post('/register', authController.register);

router.get('/user', authController.get_user);

module.exports = router;