import {host} from '../../common/const.js';
const app = getApp();
// page/index/index.js
Page({
  data: {
    userInfo: {},
    my_userInfo: {},
    statusList: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取userInfo
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo
          })
        }
      })
    }
  },
  onShow() {
    // 获取my_userInfo
    if (app.globalData.my_userInfo) {
      this.setData({
        my_userInfo: app.globalData.my_userInfo
      })
      this.sendStatusListRequest(this, this.data.my_userInfo.userId);
    } else {
      // 可能出现请求自己的服务器结果未返回时，就已经发起lover接口访问的请求（会报错）
      // 所以此处加入 callback 以防止这种情况
      app.my_userInfoIsReadyCallback = (res) => {
        if (res.data.data.msg === 'bind') {
          return;
        }
        this.setData({
          my_userInfo: app.globalData.my_userInfo
        })
        this.sendStatusListRequest(this, this.data.my_userInfo.userId);
      }
    }
  },
  sendStatusListRequest: function(e, userId) {
    wx.request({
      url: `http://${host}/api/status?userId=${userId}`,
      success: res => {
        e.setData({ statusList: res.data.data.status });
      }
    })
  },
  addStatus: function() {
    wx.navigateTo({
      url: './addstatus',
    })
  },
  deleteStatus: function(e) {
    const statusId = e.currentTarget.id;
    console.log(1)
    wx.request({
      url: `http://${host}/api/delete_status`,
      data: {
        userId: this.data.my_userInfo.userId,
        statusId
      },
      method: 'POST',
      success: (res) => {
        if(res.data.data.code === 0) {
          this.setData({
            statusList: this.data.statusList.filter((item) => {
              return item.statusId != e.currentTarget.id;
            })
          })
        }
      }
    })
  }
})