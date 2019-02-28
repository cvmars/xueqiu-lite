//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/api.js')
const API_LOGIN = '/api/customers/login_miniprogram/' //登录接口
const API_USER_UPDATE = '/customer/profile/' //修改用户信息
const API_POST_PIAOLIU = '/api/bottles-mine/' //抛出漂流瓶
const API_GET_PIAOLIU = '/api/bottles/pickone/' // 捡漂流瓶
const API_GET_EXITAPP = '/customer/logout/' //退出登录

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    inputHidden: true,
    hasUserInfo: false,
    pignziHidden: true,
    pignzijianHidden: true,
    konghidden: true,
    txtPingze:'',
    piaoliutext: '',
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
    this.onPiaoliuPao();

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

    this.onJianliuPao();
  },
  getUserInfo: function(e) {
      console.log(e)
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
    // }, 
    // onUnload: function () {
    //   //页面关闭
    //   console.log('index Unload')

    //   util.Requests(util.getBaseUrl() + API_GET_EXITAPP, data)
    //     .then((res) => {

    //     })
    // }
    ,

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

        app.globalData.userInfo = res.userInfo
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


    var that = this
    wx.login({

      //获取code
      success: function(res) {
        var code = res.code //返回code
        console.log("code :" + code);
        let data = {
          code: code
        }
        util.Requests_json(util.getBaseUrl() + API_LOGIN, data).then((res) => {

          console.log(res)

          wx.getUserInfo({
            success: res => {
              app.globalData.user = res.userInfo
              that.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })

              var username = app.globalData.userInfo.nickName
              var avatarUrl = app.globalData.userInfo.avatarUrl
              var gender = app.globalData.userInfo.gender
              var city = app.globalData.userInfo.city

              console.log('avatarUrl :' + avatarUrl);

              let data = {}
              data['name'] = username
              data['gender'] = gender
              data['avatar_url'] = avatarUrl
              console.log(this)
              that.onUpdateUserInfo(data);
            },
            fail: function() {
              //获取用户信息失败后。请跳转授权页面
              wx.showModal({
                title: '授权登陆',
                content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
                success: function(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.navigateTo({
                      url: '../login/common',
                    })
                  }
                }
              })
            }
          })

        })
      },
      fail: function() {
        //获取用户信息失败后。请跳转授权页面
        wx.showModal({
          title: '警告',
          content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.navigateTo({
                url: '../login/common',
              })
            }
          }
        })
      }
    })

  },

  //完善用户信息
  onUpdateUserInfo: function(data) {


    util.Requests_json(util.getBaseUrl() + API_USER_UPDATE, data)
      .then((res) => {

      })

  },
  bindTextAreaBlur: function(e) {

    //打印结果”是我是一个textarea”
    this.setData({
      piaoliutext: e.detail.value,
    })
  },

  //抛出漂流瓶
  onPiaoliuPao: function(e) {

    let that = this;
    let data = {};
    data['text'] = this.data.piaoliutext;
    if (!this.data.piaoliutext) {

      wx.showToast({
  
        title: '内容不能为空',
      })
      return;
    }else{
      this.setData({
        piaoliutext: '',
        inputHidden: true,
        pignziHidden: true,
        konghidden: false
      })

      util.Requests_json(util.getBaseUrl() + API_POST_PIAOLIU, data)
        .then((res) => {
          wx.showToast({
            icon: 'success',
            title: '发送成功',
          })
          that.onShareAppMessage()
        })
    }
   
  },

  onOKPiaoliu:function(e){

    this.setData({

      pignzijianHidden: true,
      txtPingze: ''
    })
  },
  //捡漂流瓶
  onJianliuPao: function(e) {


    util.Requests(util.getBaseUrl() + API_GET_PIAOLIU)
      .then((res) => {
        
        this.setData({

          pignzijianHidden: false,
          txtPingze : res.data.text
        })

        // wx.showToast({
        //   title: res,
        // })

      })
  },


  onShareAppMessage: function(res) {
    // if (res.from === 'view') {
    // 来自页面内转发按钮
    // console.log(res.target.id)
    // console.log(res.from)
    //区分按钮分享
    // if (res.target.id === "btn") {
    // return {
    //   title: '来自莲花的孔明灯',
    //   path: '/pages/title/title',
    //   imageUrl: '../../image/bg_piaoliu_share.png',
    //   success: function(res) {
    //     // 转发成功
    //   },
    //   fail: function(res) {
    //     // 转发失败
    //   }
    // }
    // }
    // }
    //右上角分享
    return {
      title: '莲花雪球',
      path: '/pages/index/index',
      imageUrl: '../../image/bg_piaoliu_share.png',
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