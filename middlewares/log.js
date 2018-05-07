'use strict';
exports.preLog = function(req, res, next) {
    // console.info('客户端请求URL:', req.url);
    next();
};
