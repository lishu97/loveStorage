const mysql = require('mysql');

const mysqlOptions = require('../config/mysqlOptions');
const pool = mysql.createPool(mysqlOptions);

// 查询userId当前是否有关系
module.exports.getCurrentRelation = function(userId) {
  const sql = `SELECT relationId,relationStartTime,relationStopTime FROM relation 
    WHERE (userId1=${userId} OR userId2=${userId}) AND relationEndTime IS NULL`;
  return new Promise(function(resolve, reject) {
    pool.query(sql, function(err, result) {
      if(err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

// 查询userId1与userId2的关系
module.exports.getRelation = function(userId1, userId2) {
  const sql = `SELECT relationId,relationStartTime,relationStopTime FROM relation 
    WHERE (userId1=${userId1} AND userId2=${userId2}) OR (userId1=${userId2} AND userId2=${userId1})`;
  return new Promise(function(resolve, reject) {
    pool.query(sql, function(err, result) {
      if(err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

// 查询userId的所有关系
module.exports.getRelations = function(userId) {
  const sql = `SELECT userId1,userId2 FROM relation WHERE userId1=${userId} OR userId2=${userId}`;
  return new Promise(function(resolve, reject) {
    pool.query(sql, function(err, result) {
      if(err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

// 查询关系中userId1和userId2字段
module.exports.getRelationUserId = function(userId) {
  const sql = `SELECT userId1,userId2 FROM relation WHERE userId1=${userId} OR userId2=${userId}`;
  return new Promise(function(resolve, reject) {
    pool.query(sql, function(err, result) {
      if(err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

// 创建userId1与userId2的关系
module.exports.startRelation = function(userId1, userId2, relationStartTime) {
  const sql = `INSERT INTO relation (userId1, userId2, relationStartTime) 
    VALUES ('${userId1}', '${userId2}', '${relationStartTime}')`;
  return new Promise(function(resolve, reject) {
    pool.query(sql, function(err, result) {
      if(err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

// 重启userId1与userId2的关系
module.exports.restartRelation = function(userId1, userId2) {
  const sql = `UPDATE relation SET relationStopTime=NULL 
    WHERE ((userId1=${userId1} AND userId2=${userId2}) OR (userId1=${userId2} AND userId2=${userId1})) AND (relationEndTime IS NOT NULL)`;
  return new Promise(function(resolve, reject) {
    pool.query(sql, function(err, result) {
      if(err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

// 关闭userId1与userId2的关系
module.exports.stopRelation = function(userId1, userId2) {
  const sql = `UPDATE relation SET relationStopTime=NULL 
    WHERE ((userId1=${userId1} AND userId2=${userId2}) OR (userId1=${userId2} AND userId2=${userId1})) AND (relationEndTime IS NOT NULL)`;
  return new Promise(function(resolve, reject) {
    pool.query(sql, function(err, result) {
      if(err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};
