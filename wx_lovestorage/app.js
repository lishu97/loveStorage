//app.js
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        const code = res.code;
        if (code) {
          // 获取my_userInfo
          wx.request({
            url: 'http://127.0.0.1:3000/api/wx/onlogin',
            data: { code },
            success: res => {
              this.globalData.openId = res.data.data.openId;
              if(res.data.data.msg === 'bind') {
                // 需要绑定帐号后使用
                wx.navigateTo({
                  url: '/pages/bind',
                })
              } else {
                // 已经绑定帐号
                this.globalData.hasBinded = true;
                this.globalData.my_userInfo = res.data.data.userInfo;
                // 可能出现请求自己的服务器结果未返回时，就已经发起lover接口访问的请求（会报错）
                // 所以此处加入 callback 以防止这种情况
                if (this.my_userInfoIsReadyCallback) {
                  this.my_userInfoIsReadyCallback(res);
                }
              }
            }
          })
        } else {
          console.log('获取用户登录态失败：' + res.errMsg);
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    my_userInfo: null,
    hasBinded: false,
    openId: null,
    loveInfo: null
  }
})
