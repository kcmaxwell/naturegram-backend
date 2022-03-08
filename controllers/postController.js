var Post = require('../models/post');


exports.post_detail = function(req, res) {
  res.send('UNIMPLEMENTED: Post Detail');  
};

exports.createPost = function(req, res) {
  console.log('createPost test');
  console.log(req.body.content);
  console.log(req.body.imageUrl);

  const newPost = new Post({
    author: req.session.userId,
    content: req.body.content,
    imageUrl: req.body.imageUrl,
    timestamp: Date.now(),
  });

  newPost.save();
  res.send('New Post Created');
};