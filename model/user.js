const mysql = require('mysql');

const mysqlOptions = require('../config/mysqlOptions');
const pool = mysql.createPool(mysqlOptions);

module.exports.createUser = function(regTime, username, password, nickname, sex, birthday, email) {
  const sql = `INSERT INTO user (regTime, username, password, nickname, sex, birthday, email) 
    VALUES ('${regTime}', '${username}', '${password}', '${nickname}', ${sex}, '${birthday}', '${email}')`;
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
  const sql = `SELECT userId,regTime,nickname,sex,birthday,email FROM user WHERE username = '${username}'`;
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
  const sql = `SELECT userId,regTime,nickname,sex,birthday,email FROM user WHERE userId = '${userId}'`;
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
  const sql = `SELECT userId,regTime,nickname,sex,birthday,email FROM user WHERE userId = '${openId}'`;
  return new Promise(function(resolve, reject) {
    pool.query(sql, function(err, result) {
        if(err) {
            return reject(err);
        }
        return resolve(result);
    });
  });
};