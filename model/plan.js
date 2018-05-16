'use strict';
const mysql = require('mysql');

const mysqlOptions = require('../config/mysqlOptions');
const pool = mysql.createPool(mysqlOptions);

module.exports.createPlan = function (relationId, planContent, planTime) {
    const sql = `INSERT INTO plan (relationId, planContent, planTime, planStatus) 
    VALUES ('${relationId}', '${planContent}', '${planTime}', 0)`;
    return new Promise(function (resolve, reject) {
        pool.query(sql, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

module.exports.getPlan = function (relationId, start, end) {
    const sql = `SELECT * FROM (SELECT * FROM plan WHERE relationId='${relationId}') AS t ORDER BY planId DESC LIMIT ${start}, ${end}`;
    return new Promise(function (resolve, reject) {
        pool.query(sql, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

module.exports.deletePlan = function (planId, relationId) {
    const sql = `DELETE FROM plan WHERE (planId='${planId}' AND relationId='${relationId}')/*relationId是为验证*/`;
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

module.exports.updatePlan = function (planId, relationId, operation) {
    operation = (operation === 'finished') ? 1 : 0;
    const sql = `UPDATE plan SET planStatus=${operation} WHERE (planId='${planId}' AND relationId='${relationId}')/*relationId为验证*/`;
    return new Promise(function (resolve, reject) {
        pool.query(sql, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};