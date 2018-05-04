const mysql = require('mysql');

const mysqlOptions = require('../config/mysqlOptions');
const pool = mysql.createPool(mysqlOptions);

module.exports.createSession = function(sessionKey, openId) {
  let sessionId = Number.parseInt((Math.random() * Math.pow(10,16)));
  // 在尾部添零
  for(sessionId; sessionId < Math.pow(10,15); sessionId * 10);
  sessionId = sessionId.toString();
  const sql = `INSERT INTO session (sessionId, sessionKey, openId) 
    VALUES ('${sessionId}', '${sessionKey}', '${openId}')`;
  return new Promise(function(resolve, reject) {
    pool.query(sql, function(err, result) {
      if(err) {
        return reject(err);
      }
      result.sessionId = sessionId;
      return resolve(result);
    });
  });
};

module.exports.getSession = function(sessionId) {
  const sql = `SELECT * FROM session WHERE sessionId='${sessionId}'`;
  return new Promise(function(resolve, reject) {
    pool.query(sql, function(err, result) {
      if(err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

module.exports.deleteSession = function(sessionId) {
  const sql = `DELETE FROM session WHERE sessionId='${sessionId}'`;
  return new Promise(function(resolve, reject) {
    pool.query(sql, function(err, result) {
      if(err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};
