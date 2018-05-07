const express = require('express');
const router = express.Router();
exports.rootPath = '/';

router.get('/', function(req, res) {
    if(!req.session.userId) {
        return res.redirect('/sign_in');
    }
    return res.render('index');
});
router.get('/sign_in', function(req, res) {
    return res.render('sign_in');
});
exports.router = router;