var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/sign_up', function(req, res, next) {
  res.render('signup', { title: 'Express' });
});

module.exports = router;