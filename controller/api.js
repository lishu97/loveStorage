var express = require('express');
var url = require('url');
var router = express.Router();
var request = require('request');

var utils = require('../utils/utils');
var user = require('../model/user');
var relation = require('../model/relation');
var status = require('../model/status');
var plan = require('../model/plan');
var anniversary = require('../model/anniversary');
const STATUS_CODE = require('../utils/status');
const REG_EXP = require('../utils/regexp');
const PAGESIZE = 6;

exports.rootPath = '/api';

// TODO:1.检验数据部分提取函数，2.充分使用正则表达式检验数据
/* 
  微信登录
*/
router.get('/wx/onlogin', (req, res, next) => {
  const { code } = url.parse(req.url, true).query;
  request.get({
    uri: 'https://api.weixin.qq.com/sns/jscode2session',
    json: true,
    qs: {
      grant_type: 'authorization_code',
      appid: 'wxb29390f3bfc81bed',
      secret: '9a12e37b6fe59bad401afcf2e467ada3',
      js_code: code
    }
  }, (err, response, data) => {
    if (response.statusCode === 200) {
      const session_key = data.session_key;
      const openid = data.openid;
      user.getUserInfoByOpenId(openid)
        .then(userInfo => {
          if(userInfo.length === 0) {
            return res.send(utils.buildResData('请绑定username与openId', { code: 0 , msg: 'bind'}));
          } else {
            return res.send(utils.buildResData('登录成功', { code: 0, sessionId: req.session.id, ...userInfo[0]}));
          }
        })
        .catch(err => utils.sqlErr(err, res));  
    } else {
      console.log("error:", err)
      res.json(err)
    }
  })
})
/* 
  微信用户绑定用户名
*/
router.post('/bind_username', (req, res, next) => {
  // 获取数据
  let {username, sessionId} = req.body;
  session.getSessionBySessionId(sessionId)
    .then(sessionInfo => {
      if(sessionInfo.length === 0) {
        return res.send(utils.buildResData('已绑定用户名', { code: 1, userInfo:userInfo[0] }));
      } else {
        user.addOpenID(username, sessionInfo[0].openId)
      }
    })
})
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
                return res.send(utils.buildResData('注册成功', { code: 0 }));
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
  function signIn() {
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
                req.session.userId = userInfo[0].userId;
                // 返回登录用户信息到前端
                return res.send(utils.buildResData('登录成功', { code: 0, ...userInfo[0] }));
              })
              .catch(err => utils.sqlErr(err, res));
          }
        })
        .catch(err => utils.sqlErr(err, res));
    }
  }
  if (req.session.userId) {
    // 先清空之前的登录状态
    req.session.regenerate(function(err) {
      if(err) {
        return res.send(utils.buildResData('登录失败', { code: 1 }));
      }
      signIn();
    });
  }else {
    signIn();
  }
});

/* 
  查询情侣信息
*/
router.get('/lover_info', function(req, res, next) {
  // 获取数据
  let { userId } = url.parse(req.url, true).query;
  userId = Number(userId);
  // 检验数据
  if((!Number.isInteger(userId)) || (userId < 0)) {
    return res.send(utils.buildResData('userId参数不合法', { code: 1 }));
  } else {
    // 检验该用户是否有绑定的情侣
    relation.getCurrentRelation(userId)
      .then(relation => {
        if(relation.length === 0){
          user.getUserInfoByUserId(userId)
            .then(userInfo => {
              if(userInfo.length !== 0) {
                return res.send(utils.buildResData(`userId=${userId}的用户当前未绑定情侣`, { code: 0, lover:{} }));
              }
              return  res.send(utils.buildResData(`不存在userId=${userId}的用户`, { code: 0, lover:{} }));
            })
            .catch(err => utils.sqlErr(err, res));
        } else {
          // 当前关系信息在relation[0]中
          const { userId1, userId2 } = relation[0];
          const loverId = Number(userId1) === Number(userId) ? userId2 : userId1
          // 根据情侣ID获取信息
          user.getUserInfoByUserId(loverId)
            .then(loverInfo => {
              loverInfo = utils.formatInfo(loverInfo);
              res.send(utils.buildResData('当前已绑定情侣', { code: 0, lover:{...loverInfo[0]} }));
            })
            .catch(err => utils.sqlErr(err, res));
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
    user.getUserInfoByUserId(userId1)
      .then(userInfo1 => {
        if(userInfo1.length === 0) {
          // userId1用户不存在
          return res.send(utils.buildResData(`不存在userId=${userId1}的用户`, { code: 1 }));
        }
        user.getUserInfoByUserId(userId2)
          .then(userInfo2 => {
            if(userInfo2.length === 0) {
              // userId2用户不存在
              return res.send(utils.buildResData(`不存在userId=${userId2}的用户`, { code: 1 }));
            }
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
                          relation.getRelation(userId1, userId2)
                            .then(relationInfo => {
                              if(relationInfo.length === 0){
                                // 创建关系操作
                                const time = `${utils.getDate()} ${utils.getTime()}`;
                                relation.startRelation(userId1, userId2, time) 
                                  .then(result => {
                                    if(result.affectedRows === 1) {
                                      res.send(utils.buildResData('创建关系成功', { code: 0 , date: { userId1, userId2 } }));                                
                                    }
                                  })
                                  .catch(err => utils.sqlErr(err, res));
                              } else {
                                // 更新关系操作
                                relation.updateRelation(userId1, userId2)
                                  .then(result => {
                                    if(result.affectedRows === 1) {
                                      res.send(utils.buildResData('重启关系成功', { code: 0 , date: { userId1, userId2 } }));                                
                                    }
                                  })
                                  .catch(err => utils.sqlErr(err, res));
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
                    return res.send(utils.buildResData(`userId1=${userId1}的用户与userId2=${userId2}的用户无关系记录`, { code: 1 }));
                  } else {
                    // 解除绑定
                    const time = `${utils.getDate()} ${utils.getTime()}`;
                    relation.updateRelation(userId1, userId2, time)
                      .then(result => {
                        if(result.affectedRows === 1) {
                          res.send(utils.buildResData('解绑操作成功', { code: 0 , date: { userId1, userId2, time } }));
                        } else {
                          res.send(utils.buildResData(`解绑操作失败，这段关系已经被中止}`, { code: 1 , date: { userId1, userId2, time } }));
                        }
                      })
                      .catch(err => utils.sqlErr(err, res));
                  }
                })
                .catch(err => utils.sqlErr(err, res));   
            }
          })
          .catch(err => utils.sqlErr(err, res));
      })
      .catch(err => utils.sqlErr(err, res));
  }
});

/* 
  查询status
*/
router.get('/status', (req, res, next) => {
  // 获取数据
  let {userId, page} = url.parse(req.url, true).query;
  userId = Number(userId);
  page = Number(page);
  // 检验数据
  if((!Number.isInteger(userId)) || (userId < 0)) {
    return res.send(utils.buildResData('userId不合法', { code: 1 }));
  } else if((!Number.isInteger(page)) || (page < 0)) {
    return res.send(utils.buildResData('page不合法', { code: 1 }));
  } else {
    const start = PAGESIZE * page;
    const end = PAGESIZE * (page + 1);
    // 获取status分页
    status.getStatus(userId, start, end)
      .then(statusInfo => {
        if(statusInfo.length > 0) {
          statusInfo = statusInfo.map(element => {
            element.statusTime = `${utils.formatDate(element.statusTime).date} ${utils.formatDate(element.statusTime).time}`;
            return element;
          });
          res.send(utils.buildResData(`获取userId=${userId}&page=${page}的status成功`, { code: 0, date:statusInfo }));
        } else {
          res.send(utils.buildResData(`没有记录`, { code: 0, date:statusInfo }));
        }      
      })
      .catch(err => utils.sqlErr(err, res));
  }
});

/* 
  新增status
*/
router.post('/create_status', function(req, res, next) {
  // 获取数据
  let {userId, statusContent, statusTime} = req.body;
  userId = Number(userId);
  statusTime = new Date(statusTime);
  // 检验数据
  if(!Number.isInteger(userId) || userId < 0) {
    return res.send(utils.buildResData('userId不符合规范', { code: 1 }));
  } else if(!statusContent) {
    return res.send(utils.buildResData('statusContent为空', { code: 1 }));
  } else if(statusTime > new Date()){
    return res.send(utils.buildResData('statusTime错误', { code: 1 }));
  } else {
    statusTime = `${utils.formatDate(statusTime).date} ${utils.formatDate(statusTime).time}`;
    status.createStatus(userId, statusContent, statusTime)
      .then(result => {
        if(result.affectedRows === 1) {
          return res.send(utils.buildResData('status创建完成', { code: 0, date: { userId, statusContent, statusTime } }));
        }
        return res.send(utils.buildResData('创建status时发生未知错误', { code: 1 }));
      })
      .catch(err => utils.sqlErr(err, res));
  }
});
/* 
  删除status
*/
router.post('/delete_status', function(req, res, next) {
  // 获取数据
  let {userId, statusId} = req.body;
  userId = Number(userId);
  statusId = Number(statusId);
  // 检验数据
  if(!Number.isInteger(userId) || userId < 0) {
    return res.send(utils.buildResData('userId不符合规范', { code: 1 }));
  } else if(!Number.isInteger(statusId) || statusId < 0) {
    return res.send(utils.buildResData('statusId不符合规范', { code: 1 }));
  } else {
    status.deleteStatus(statusId, userId)
      .then(result => {
        if(result.affectedRows === 1) {
          return res.send(utils.buildResData('status删除完成', { code: 0, date: { userId, statusId } }));
        }
        return res.send(utils.buildResData('不存在这条记录 || 这条记录已被删除', { code: 1 }));
      })
      .catch(err => utils.sqlErr(err, res));
  }
});
/* 
  查询plan
*/
router.get('/plan', (req, res, next) => {
  // 获取数据
  let {relationId, page} = url.parse(req.url, true).query;
  relationId = Number(relationId);
  page = Number(page);
  // 检验数据
  if((!Number.isInteger(relationId)) || (relationId < 0)) {
    return res.send(utils.buildResData('relationId不合法', { code: 1 }));
  } else if((!Number.isInteger(page)) || (page < 0)) {
    return res.send(utils.buildResData('page不合法', { code: 1 }));
  } else {
    relation.getRelationById(relationId)
      .then(relationInfo => {
        if(!relationInfo.length){
          res.send(utils.buildResData(`不存在relationId=${relationId}的relation`, { code: 1 }));
        } else {        
          const start = PAGESIZE * page;
          const end = PAGESIZE * (page + 1);
          // 获取plan分页
          plan.getPlan(relationId, start, end)
            .then(planInfo => {
              if(planInfo.length > 0) {
                planInfo = planInfo.map(element => {
                  element.planTime = `${utils.formatDate(element.planTime).date} ${utils.formatDate(element.planTime).time}`;
                  return element;
                });
                res.send(utils.buildResData(`获取relationId=${relationId}&page=${page}的plan成功`, { code: 0, date:planInfo }));
              } else {
                res.send(utils.buildResData(`没有记录`, { code: 0, date:planInfo }));
              }      
            })
            .catch(err => utils.sqlErr(err, res));
        }
      })
      .catch(err => utils.sqlErr(err, res));
  }
});

/* 
  新增plan
*/
router.post('/create_plan', function(req, res, next) {
  // 获取数据
  let {relationId, planContent, planTime} = req.body;
  relationId = Number(relationId);
  planTime = new Date(planTime);
  // 检验数据
  if(!Number.isInteger(relationId) || relationId < 0) {
    return res.send(utils.buildResData('relationId不符合规范', { code: 1 }));
  } else if(!planContent) {
    return res.send(utils.buildResData('planContent不能为空', { code: 1 }));
  } else {
    relation.getRelationById(relationId)
      .then(relationInfo => {
        if(!relationInfo.length){
          res.send(utils.buildResData(`不存在relationId=${relationId}的relation`, { code: 1 }));
        } else {        
          planTime = `${utils.formatDate(planTime).date} ${utils.formatDate(planTime).time}`;
          plan.createPlan(relationId, planContent, planTime)
            .then(result => {
              if(result.affectedRows === 1) {
                return res.send(utils.buildResData('plan创建完成', { code: 0, date: { relationId, planContent, planTime, planStatus:0 } }));
              }
              return res.send(utils.buildResData('创建plan时发生未知错误', { code: 1 }));
            })
            .catch(err => utils.sqlErr(err, res));
        }
      })
      .catch(err => utils.sqlErr(err, res));
  }
});
/* 
  更新plan
*/
router.post('/update_plan', function(req, res, next) {
  // 获取数据
  let {relationId, planId, operation} = req.body;
  relationId = Number(relationId);
  planId = Number(planId);
  // 检验数据
  if(!Number.isInteger(relationId) || relationId < 0) {
    return res.send(utils.buildResData('relationId不符合规范', { code: 1 }));
  } else if(!Number.isInteger(planId) || planId < 0) {
    return res.send(utils.buildResData('planId不符合规范', { code: 1 }));
  } else if(operation !== 'finished' && operation !== 'todo') {
    return res.send(utils.buildResData('operation不符合规范', { code: 1 }));
  } else {
    relation.getRelationById(relationId)
      .then(relationInfo => {
        if(!relationInfo.length){
          res.send(utils.buildResData(`不存在relationId=${relationId}的relation`, { code: 1 }));
        } else {
          plan.updatePlan(planId, relationId, operation)
            .then(result => {
              if(result.affectedRows === 1) {
                return res.send(utils.buildResData('plan更新完成', { code: 0, date: { relationId, planId } }));
              }
              return res.send(utils.buildResData('不存在这条记录 || 这条记录已被删除', { code: 1 }));
            })
            .catch(err => utils.sqlErr(err, res));
        }
      })
      .catch(err => utils.sqlErr(err, res));
  }
});
/* 
  删除plan
*/
router.post('/delete_plan', function(req, res, next) {
  // 获取数据
  let {relationId, planId} = req.body;
  relationId = Number(relationId);
  planId = Number(planId);
  // 检验数据
  if(!Number.isInteger(relationId) || relationId < 0) {
    return res.send(utils.buildResData('relationId不符合规范', { code: 1 }));
  } else if(!Number.isInteger(planId) || planId < 0) {
    return res.send(utils.buildResData('planId不符合规范', { code: 1 }));
  } else {
    relation.getRelationById(relationId)
      .then(relationInfo => {
        if(!relationInfo.length){
          res.send(utils.buildResData(`不存在relationId=${relationId}的relation`, { code: 1 }));
        } else {
          plan.deletePlan(planId, relationId)
          .then(result => {
            if(result.affectedRows === 1) {
              return res.send(utils.buildResData('plan删除完成', { code: 0, date: { relationId, planId } }));
            }
            return res.send(utils.buildResData('不存在这条记录 || 这条记录已被删除', { code: 1 }));
          })
          .catch(err => utils.sqlErr(err, res));
        }
      })
      .catch(err => utils.sqlErr(err, res));
  }
});
/* 
  查询anniversary
*/
router.get('/anniversary', (req, res, next) => {
  // 获取数据
  let {relationId} = url.parse(req.url, true).query;
  relationId = Number(relationId);
  // 检验数据
  if((!Number.isInteger(relationId)) || (relationId < 0)) {
    return res.send(utils.buildResData('relationId不合法', { code: 1 }));
  } else {
    relation.getRelationById(relationId)
      .then(relationInfo => {
        if(!relationInfo.length){
          res.send(utils.buildResData(`不存在relationId=${relationId}的relation`, { code: 1 }));
        } else {
          anniversary.getAnniversary(relationId)
            .then(anniversaryInfo => {
              if(anniversaryInfo.length > 0) {
                anniversaryInfo = anniversaryInfo.map(element => {
                  element.anniversaryTime = `${utils.formatDate(element.anniversaryTime).date} ${utils.formatDate(element.anniversaryTime).time}`;
                  return element;
                });
                res.send(utils.buildResData(`获取relationId=${relationId}的anniversary成功`, { code: 0, date:anniversaryInfo }));
              } else {
                res.send(utils.buildResData(`没有记录`, { code: 0, date:anniversaryInfo }));
              }      
            })
            .catch(err => utils.sqlErr(err, res));
        }
      })
      .catch(err => utils.sqlErr(err, res));
  }
});

/* 
  新增anniversary
*/
router.post('/create_anniversary', function(req, res, next) {
  // 获取数据
  let {relationId, anniversaryContent, anniversaryTime} = req.body;
  relationId = Number(relationId);
  anniversaryTime = new Date(anniversaryTime);
  // 检验数据
  if(!Number.isInteger(relationId) || relationId < 0) {
    return res.send(utils.buildResData('relationId不符合规范', { code: 1 }));
  } else if(!anniversaryContent) {
    return res.send(utils.buildResData('anniversaryContent不能为空', { code: 1 }));
  } else {
    relation.getRelationById(relationId)
      .then(relationInfo => {
        if(!relationInfo.length){
          res.send(utils.buildResData(`不存在relationId=${relationId}的relation`, { code: 1 }));
        } else {
          anniversaryTime = `${utils.formatDate(anniversaryTime).date} ${utils.formatDate(anniversaryTime).time}`;
          anniversary.createAnniversary(relationId, anniversaryContent, anniversaryTime)
            .then(result => {
              if(result.affectedRows === 1) {
                return res.send(utils.buildResData('anniversary创建完成', { code: 0, date: { relationId, anniversaryContent, anniversaryTime, anniversaryStatus:0 } }));
              }
              return res.send(utils.buildResData('创建anniversary时发生未知错误', { code: 1 }));
            })
            .catch(err => utils.sqlErr(err, res));
        }
      })
      .catch(err => utils.sqlErr(err, res));
  }
});
/* 
  删除anniversary
*/
router.post('/delete_anniversary', function(req, res, next) {
  // 获取数据
  let {relationId, anniversaryId} = req.body;
  relationId = Number(relationId);
  anniversaryId = Number(anniversaryId);
  // 检验数据
  if(!Number.isInteger(relationId) || relationId < 0) {
    return res.send(utils.buildResData('relationId不符合规范', { code: 1 }));
  } else if(!Number.isInteger(anniversaryId) || anniversaryId < 0) {
    return res.send(utils.buildResData('anniversaryId不符合规范', { code: 1 }));
  } else {
    relation.getRelationById(relationId)
      .then(relationInfo => {
        if(!relationInfo.length){
          res.send(utils.buildResData(`不存在relationId=${relationId}的relation`, { code: 1 }));
        } else {
          anniversary.deleteAnniversary(anniversaryId, relationId)
            .then(result => {
              if(result.affectedRows === 1) {
                return res.send(utils.buildResData('anniversary删除完成', { code: 0, date: { relationId, anniversaryId } }));
              }
              return res.send(utils.buildResData('不存在这条记录 || 这条记录已被删除', { code: 1 }));
            })
            .catch(err => utils.sqlErr(err, res));
        }
      })
      .catch(err => utils.sqlErr(err, res));
  }
});

exports.router = router;
