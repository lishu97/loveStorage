'use strict';

const STATUS_CODE = require('../utils/status');

module.exports.checkLogin = function(req, res, next) {
    if(!req.session.userId) {
        let err = new Error('没有登录');
        err.status = STATUS_CODE.NO_PERMISSION;
        return next(err);
    }    
    return next();
};
