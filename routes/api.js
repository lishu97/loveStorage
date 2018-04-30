var express = require('express');
var url = require('url');
var router = express.Router();

var utils = require('../utils/utils');
var user = require('../model/user');
var relation = require('../model/relation')
const STATUS_CODE = require('../utils/status');
const REG_EXP = require('../utils/regexp');

/* 
  用户注册
*/
router.post('/sign_up', (req, res, next) => {
  // 获取数据
  let {username, password, nickname, sex, birthday, email} = req.body;
  // 检验数据
  if(!REG_EXP.username.test(username)) {
    return res.send(utils.buildResData('用户名不符合规范', { code: 1 }));
  } else if(!REG_EXP.password.test(password)) {
    return res.send(utils.buildResData('密码不符合规范', { code: 1 }));
  } else {
    // 检验用户名是否重复
    user.getUserInfoByUsername(username)
      .then(userInfo => {
        if(userInfo.length) {
          return res.send(utils.buildResData('用户名已存在', { code: 1 }));
        } else {
          // 处理数据
          const regTime = `${utils.getDate()} ${utils.getTime()}`;
          nickname = nickname || username;
          sex = sex || 0;
          birthday = birthday || `${utils.getDate()}`;
          email = email || ``;
          // 录入数据库
          user.createUser(regTime, username, password, nickname, sex, birthday, email)
            .then(result => {
              if(result.affectedRows === 1) {
                return res.send(utils.buildResData('注册成功', { code: 1 }));
              }
            })
            .catch(err => utils.sqlErr(err, res));
        }
      })
      .catch(err => utils.sqlErr(err, res));
  }
});

/* 
  用户登录
*/
router.post('/sign_in', function(req, res, next) {
  // 获取数据
  const {username, password} = req.body;
  // 检验数据
  if(!REG_EXP.username.test(username)) {
    return res.send(utils.buildResData('用户名不符合规范', { code: 1 }));
  } else if(!REG_EXP.password.test(password)) {
    return res.send(utils.buildResData('密码不符合规范', { code: 1 }));
  } else {
    // 检验用户名与密码是否匹配
    user.getUserPassword(username)
      .then(sqlPassword => {
        if(sqlPassword.length === 0) {
          // 登录失败
          return res.send(utils.buildResData('用户名不存在', { code: 1 }));
        } else if(password !== sqlPassword[0].password) {
          // 登录失败
          return res.send(utils.buildResData('用户名或密码错误', { code: 1 }));
        } else {
          // 登录成功
          user.getUserInfoByUsername(username)
            .then(userInfo => {
              userInfo = utils.formatInfo(userInfo);
              // 返回登录用户信息到前端
              return res.send(utils.buildResData('登录成功', { code: 0, ...userInfo[0] }));
            })
            .catch(err => utils.sqlErr(err, res));
        }
      })
      .catch(err => utils.sqlErr(err, res));
  }
});

/* 
  查询情侣信息
*/
router.get('/get_lover_info', function(req, res, next) {
  // 获取数据
  let { userId } = url.parse(req.url, true).query;
  userId = Number(userId);
  // 检验数据
  if((!Number.isInteger(userId)) || (userId < 0)) {
    return res.send(utils.buildResData('参数不合法', { code: 1 }));
  } else {
    // 检验该用户是否有绑定的情侣
    relation.getCurrentRelation(userId)
      .then(relation => {
        if(relation.length === 0){
          // 当前无绑定情侣
          res.send(utils.buildResData('该用户当前未绑定情侣 || 不存在该用户', { code: 0, lover:{} }));
        } else {
          // 当前关系信息在relation[0]中
          const { userId1, userId2 } = relation[0];
          let loverId = '';
          if(Number(userId1) === Number(userId)) {
            loverId = userId2;
          } else {
            loverId = userId1;
          }
          // 根据情侣ID获取信息
          user.getUserInfoByUserId(loverId)
            .then(loverInfo => {
              loverInfo = utils.formatInfo(loverInfo);
              res.send(utils.buildResData('当前已绑定情侣', { code: 0, lover:{...loverInfo[0]} }));
            })
            .catch(err => utils.sqlErr(err, res))
        }
      })
      .catch(err => utils.sqlErr(err, res));
  }
});

/* 
  绑定/解除情侣
*/
router.post('/update_relation', function(req, res, next) {
  // 获取数据
  let { userId1, userId2,  operation } = req.body;
  userId1 = Number(userId1);
  userId2 = Number(userId2);
  // 检验数据
  if((!Number.isInteger(userId1)) || (userId1 < 0)) {
    return res.send(utils.buildResData('userId1不合法', { code: 1 }));
  } else if((!Number.isInteger(userId2)) || (userId2 < 0)){
    return res.send(utils.buildResData('userId2不合法', { code: 1 }));
  } else if(!(operation === 'start' || operation === 'stop')) {
    return res.send(utils.buildResData('operation不合法', { code: 1 }));
  } else {
    
    if(operation === 'start') {
      // 绑定
      relation.getCurrentRelation(userId1)
        .then(relationInfo1 => {
          // 检验userID1当前是否已绑定情侣
          if(relationInfo1.length && !relationInfo1[0].relationStopTime) {
            return res.send(utils.buildResData('userId1已绑定情侣', { code: 1 }));
          } else {
            relation.getCurrentRelation(userId2)
              .then(relationInfo2 => {
                // 检验userID2当前是否已绑定情侣
                if(relationInfo2.length && !relationInfo2[0].relationStopTime) {
                  return res.send(utils.buildResData('userId2已绑定情侣', { code: 1 }));
                } else {
                  // 绑定操作
                  relation.updateRelation(userId1, userId2)
                    .then(result => {
                      if(result.affectedRows === 1) {
                        res.send(utils.buildResData('绑定操作成功', { code: 0 , date: { userId1, userId2 } }));
                      } else {
                        res.send(utils.buildResData(`绑定操作失败，造成原因：不存在这样的关系 || 这段关系已经被启动}`, { code: 1 , date: { userId1, userId2 } }));
                      }
                    })
                    .catch(err => utils.sqlErr(err, res));
                }
              })
              .catch(err => utils.sqlErr(err, res));
          }
        })
        .catch(err => utils.sqlErr(err, res));
    } else {
      // 解绑
      relation.getRelation(userId1, userId2)
        .then(relationInfo => {
          if(!relationInfo[0]) {
            return res.send(utils.buildResData('userId1与userId2非情侣，不需要解除关系', { code: 1 }));
          } else {
            // 解除绑定
            const time = `${utils.getDate()} ${utils.getTime()}`;
            relation.updateRelation(userId1, userId2, time)
              .then(result => {
                if(result.affectedRows === 1) {
                  res.send(utils.buildResData('解绑操作成功', { code: 0 , date: { userId1, userId2, time } }));
                } else {
                  res.send(utils.buildResData(`解绑操作失败，造成原因：不存在这样的关系 || 这段关系已经被中止}`, { code: 1 , date: { userId1, userId2, time } }));
                }
              })
              .catch(err => utils.sqlErr(err, res));
          }
        })
        .catch(err => utils.sqlErr(err, res));   
    }
  }
});



module.exports = router;
