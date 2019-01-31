//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/api.js')

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    inputHidden: true,
    hasUserInfo: false,
    pignziHidden: true,
    pignzijianHidden: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  shareInput: function(e) {

    console.log('shareinput')
    this.setData({
      inputHidden: false
    })
  },

  onSubPiaoliu: function(e) {
    this.setData({
      inputHidden: true
    })

    wx.showToast({
      icon: 'success',
      title: '发送成功',
    })

  },
  onNearby: function(e) {

    wx.navigateTo({
      url: '../logs/logs',
    })
  },

  onPiaoliu: function(e) {

    wx.navigateTo({
      url: '../piaoliu/logs',
    })
  },

  onAbout: function(e) {

    wx.navigateTo({
      url: '../about/about',
    })
  },

  onpingzi: function(e) {

    console.log('onpingzi')

    this.setData({

      pignziHidden: false
    })

  },

  onLoad: function() {
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


    wx.login({
      //获取code
      success: function(res) {
        var code = res.code //返回code
        console.log("code :" + code);
        let data = { code : code }
        util.Requests_json("https://test.lhxq.top/api/customers/login_miniprogram/", data).then((res) => {

         
          console.log(res)

        })
      }
    })
  },


  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onShareAppMessage: function(res) {
    // if (res.from === 'view') {
    // 来自页面内转发按钮
    console.log(res.target.id)
    console.log(res.from)
    //区分按钮分享
    // if (res.target.id === "btn") {
    return {
      title: '来自莲花的漂流瓶',
      path: '/pages/title/title',
      imageUrl: '../../image/bg_piaoliu_share.jpg',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
    // }
    // }
    //右上角分享
    return {
      title: '莲花雪球',
      path: `pages/index/index`,
      imageUrl: ``,
      success: function(res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }


})