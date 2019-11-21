app.post('/register', function(req, res) {
  var new_user = new User({
    username: req.username,
  });

  new_user.password = new_user.generateHash(req.body.password);
  new_user.save();
});
