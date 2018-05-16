'use strict';
const mysql = require('mysql');

const mysqlOptions = require('../config/mysqlOptions');
const pool = mysql.createPool(mysqlOptions);

module.exports.createAnniversary = function (relationId, anniversaryContent, anniversaryTime) {
    const sql = `INSERT INTO anniversary (relationId, anniversaryContent, anniversaryTime) 
    VALUES ('${relationId}', '${anniversaryContent}', '${anniversaryTime}')`;
    return new Promise(function (resolve, reject) {
        pool.query(sql, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

module.exports.getAnniversary = function (relationId) {
    const sql = `SELECT * FROM anniversary WHERE relationId='${relationId}'`;
    return new Promise(function (resolve, reject) {
        pool.query(sql, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

module.exports.deleteAnniversary = function (anniversaryId, relationId) {
    const sql = `DELETE FROM anniversary WHERE (anniversaryId='${anniversaryId}' AND relationId='${relationId}')/*relationId是为验证*/`;
    console.log(sql);
    return new Promise(function (resolve, reject) {
        pool.query(sql, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

module.exports.updateAnniversary = function (anniversaryId, relationId, operation) {
    operation = (operation === 'finished') ? 1 : 0;
    const sql = `UPDATE anniversary SET anniversaryStatus=${operation} WHERE (anniversaryId='${anniversaryId}' AND relationId='${relationId}')/*relationId为验证*/`;
    return new Promise(function (resolve, reject) {
        pool.query(sql, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};