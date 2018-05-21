const app = getApp();

Page({
  data: {
    my_userInfo: null,
    userInfo: null,
    hasUserInfo: false,
    loveInfo: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    if (app.globalData.my_userInfo) {
      this.init(this);
    } else {
      // 可能出现请求自己的服务器结果未返回时，就已经发起lover接口访问的请求（会报错）
      // 所以此处加入 callback 以防止这种情况
      app.my_userInfoIsReadyCallback = (res) => {
        if(res.data.data.msg === 'bind') {
          return;
        }
        this.init(this);
      }
    }
    if(this.data.my_userInfo) {
      this.getLoverInfo(this);
    }
    
  },
  getUserInfo: (e) => {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  init: (e) => {
    e.setData({
      my_userInfo: app.globalData.my_userInfo,
      requestHeader: app.globalData.requestHeader
    })
  },
  getLoverInfo: (e) => {
    const url = 'http://127.0.0.1:3000/api/lover_info?userId=' + e.data.my_userInfo.userId;
    wx.request({
      url: url,
      header: e.data.requestHeader,
      success: res => {
        e.setData({ loverInfo: res.data.data.lover });
      }
    })
  }
})



