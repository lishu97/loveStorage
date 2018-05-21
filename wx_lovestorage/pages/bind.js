// pages/bind.js
import util from '../common/util.js';
import {host, regExp} from '../common/const.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    operation: 'signUp',
    warn: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  radioChange: function () {
    if(this.data.operation === 'signUp') {
      this.setData({
        operation: 'bind'
      })
    } else {
      this.setData({
        operation: 'signUp'
      })
    }
  },
  // bindDateChange: function (e) {
  //   this.setData({
  //     date: e.detail.value
  //   })
  // },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    this.setData({ warn: '' });
    if(this.data.operation === 'signUp') {
      // 注册
      const { username, password, passwordCheck, nickname } = e.detail.value;
      if (!regExp.username.test(username)) {
        this.setData({
          warn: "用户名不合法！"
        })
        return;
      } else if (!regExp.password.test(password)) {
        this.setData({
          warn: "密码不合法！"
        })
        return;
      } else if (password !== passwordCheck) {
        this.setData({
          warn: "两次密码输入不一致！"
        })
        return;
      }
      this.sendSignUpRequest(this, username, password, nickname, this.sendBindRequset);
    } else {
      // 绑定
      const { username, password } = e.detail.value;
      if (!regExp.username.test(username)) {
        this.setData({
          warn: "用户名不合法！"
        })
        return;
      } else if (!regExp.password.test(password)) {
        this.setData({
          warn: "密码不合法！"
        })
        return;
      }
      this.sendBindRequest(this, username, password, app.globalData.openId);
    } 
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  sendSignUpRequest: function (that, username, password, nickname, cb) {
    wx.request({
      url: 'http://' + host + '/api/sign_up',
      data: {
        username,
        password,
        nickname
      },
      method: 'POST',
      success: (res) => {
        if (res.data.data.code === 1) {
          that.setData({
            warn: res.data.msg
          })
          return;
        }
        app.globalData.my_userInfo = res.data.data.userInfo;
        that.setData({
          warn: "注册成功, 请选择绑定后继续操作"
        })
        cb && cb(that, username, password, app.globalData.openId)
      },
      fail: (res) => {
        that.setData({
          warn: res.toString()
        })
      }
    })
  },
  sendBindRequest: function(that, username, password, openId) {
    wx.request({
      url: 'http://' + host + '/api/wx/bind',
      data: {
        username,
        password,
        openId
      },
      method: 'POST',
      success: (res) => {
        if (res.data.data.code === 1) {
          that.setData({
            warn: res.data.msg
          })
          return;
        }
        app.globalData.hasBinded = true;
        app.globalData.my_userInfo = res.data.data.userInfo;
        that.setData({
          warn: "绑定成功，请返回"
        })
      },
      fail: (res) => {
        that.setData({
          warn: res.toString()
        })
      }
    })
  } 
})