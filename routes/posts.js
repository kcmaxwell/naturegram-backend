const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');

router.get('/:id', postController.post_detail);

// POST request for creating a new post
router.post('/', postController.createPost);

module.exports = router;