var express = require('express');
var router = express.Router();

var utils = require('../utils/utils');
var user = require('../model/user');
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
    user.getUserInfo(username)
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
          user.getUserInfo(username)
            .then(userInfo => {
              // 转换时间格式
              userInfo[0].birthday = utils.formatDate(userInfo[0].birthday).date;
              userInfo[0].regTime = `${utils.formatDate(userInfo[0].regTime).date} ${utils.formatDate(userInfo[0].regTime).time}`;
              // 返回登录用户信息到前端
              return res.send(utils.buildResData('登录成功', { code: 0, ...userInfo[0] }));
            })
            .catch(err => utils.sqlErr(err, res));
        }
      })
      .catch(err => utils.sqlErr(err, res));
  }
});

module.exports = router;
