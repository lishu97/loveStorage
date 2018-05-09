const mysql = require('mysql');

const mysqlOptions = require('../config/mysqlOptions');
const pool = mysql.createPool(mysqlOptions);

module.exports.createUser = function(regTime, username, password, nickname, avatar) {
  const sql = `INSERT INTO user (regTime, username, password, nickname, avatar) 
    VALUES ('${regTime}', '${username}', '${password}', '${nickname}', '${avatar}')`;
  return new Promise(function(resolve, reject) {
    pool.query(sql, function(err, result) {
        if(err) {
            return reject(err);
        }
        return resolve(result);
    });
  });
};

module.exports.addOpenID = function(username, openId) {
  const sql = `INSERT INTO user (openId) 
    VALUES ('${openId}') WHERE username = '${username}'`;
  return new Promise(function(resolve, reject) {
    pool.query(sql, function(err, result) {
        if(err) {
            return reject(err);
        }
        return resolve(result);
    });
  });
};

module.exports.getUserPassword = function(username) {
  const sql = `SELECT password FROM user WHERE username = '${username}'`;
  return new Promise(function(resolve, reject) {
    pool.query(sql, function(err, result) {
        if(err) {
            return reject(err);
        }
        return resolve(result);
    });
  });
};

module.exports.getUserInfoByUsername = function(username) {
  const sql = `SELECT userId,regTime,nickname,avatar FROM user WHERE username = '${username}'`;
  return new Promise(function(resolve, reject) {
    pool.query(sql, function(err, result) {
        if(err) {
            return reject(err);
        }
        return resolve(result);
    });
  });
};

module.exports.getUserInfoByUserId = function(userId) {
  const sql = `SELECT userId,regTime,nickname,avatar FROM user WHERE userId = '${userId}'`;
  return new Promise(function(resolve, reject) {
    pool.query(sql, function(err, result) {
        if(err) {
            return reject(err);
        }
        return resolve(result);
    });
  });
};

module.exports.getUserInfoByOpenId = function(openId) {
  const sql = `SELECT userId,regTime,nickname,avatar FROM user WHERE openId = '${openId}'`;
  return new Promise(function(resolve, reject) {
    pool.query(sql, function(err, result) {
        if(err) {
            return reject(err);
        }
        return resolve(result);
    });
  });
};