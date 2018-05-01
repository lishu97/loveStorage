const mysql = require('mysql');

const mysqlOptions = require('../config/mysqlOptions');
const pool = mysql.createPool(mysqlOptions);

module.exports.createStatus = function(userId, statusContent, statusTime) {
  const sql = `INSERT INTO status (userId, statusContent, statusTime) 
    VALUES ('${userId}', '${statusContent}', '${statusTime}')`;
  return new Promise(function(resolve, reject) {
    pool.query(sql, function(err, result) {
      if(err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

module.exports.getStatus = function(userId, start, end) {
  const sql = `SELECT * FROM (SELECT * FROM status WHERE userId='${userId}') AS t ORDER BY statusId DESC LIMIT ${start}, ${end}`;
  return new Promise(function(resolve, reject) {
    pool.query(sql, function(err, result) {
      if(err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

module.exports.deleteStatus = function(statusId, userId) {
  const sql = `DELETE FROM status WHERE (statusId='${statusId}' AND userId='${userId}')/*userId是为验证*/`;
  return new Promise(function(resolve, reject) {
    pool.query(sql, function(err, result) {
      if(err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};
