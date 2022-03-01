var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');

// GET request for showing the user's profile
router.get('/:id', userController.user_profile);

module.exports = router;