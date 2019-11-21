app.post('/login', function(req, res) {
  User.findOne({ username: req.body.username }, function(err, user) {
    if (!user.validPassword(req.body.password)) {
      //password did not match
    } else {
      // password matched. proceed forward
    }
  });
});
