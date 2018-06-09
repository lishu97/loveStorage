'use strict';
const mysql = require('mysql');

const mysqlOptions = require('../config/mysqlOptions');
const pool = mysql.createPool(mysqlOptions);

module.exports.createUser = function (regTime, username, password, nickname, avatar, loveId) {
    const sql = `INSERT INTO user (regTime, username, password, nickname, avatar, loveId) 
      VALUES ('${regTime}', '${username}', '${password}', '${nickname}', '${avatar}', '${loveId}')`;
    return new Promise(function (resolve, reject) {
        pool.query(sql, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

module.exports.addOpenID = function (username, openId) {
    const sql = `UPDATE user SET openId='${openId}' 
        WHERE username='${username}'`;
    return new Promise(function (resolve, reject) {
        pool.query(sql, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

module.exports.getUserPassword = function (username) {
    const sql = `SELECT password FROM user WHERE username = '${username}'`;
    return new Promise(function (resolve, reject) {
        pool.query(sql, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

module.exports.getUserInfoByUsername = function (username) {
    const sql = `SELECT userId,regTime,nickname,avatar,loveId,username FROM user WHERE username = '${username}'`;
    return new Promise(function (resolve, reject) {
        pool.query(sql, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

module.exports.getUserInfoByUserId = function (userId) {
    const sql = `SELECT userId,regTime,nickname,avatar,loveId FROM user WHERE userId = '${userId}'`;
    return new Promise(function (resolve, reject) {
        pool.query(sql, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

module.exports.getUserInfoByOpenId = function (openId) {
    const sql = `SELECT userId,regTime,username,nickname,avatar,loveId FROM user WHERE openId = '${openId}'`;
    return new Promise(function (resolve, reject) {
        pool.query(sql, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

module.exports.getUserIdByLoveId = function (loveId) {
    const sql = `SELECT userId FROM user WHERE loveId = '${loveId}'`;
    return new Promise(function (resolve, reject) {
        pool.query(sql, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};