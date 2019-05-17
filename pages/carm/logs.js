//logs.js

const app = getApp()
const util = require('../../utils/api.js')
const timeUtils = require('../../utils/util.js')
const API_LAST_PERSON = '/customer/active/lists/' //最近在线的人接口
const API_LOGIN = '/api/customers/login_miniprogram/' //登录接口
const API_USER_UPDATE = '/customer/profile/' //修改用户信息
const API_POST_PIAOLIU = '/api/bottles-mine/' //抛出漂流瓶
const API_GET_PIAOLIU = '/api/bottles/pickone/' // 捡漂流瓶
const API_GET_EXITAPP = '/customer/logout/' //退出登录


Page({
  data: {
    results: [],
    times:[],
    userInfo: {}
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onLoad: function (event) {

    var that = this

    wx.cloud.init({
      env: 'lianhua-82fcb3',
       traceUser : true})
  

    const db = wx.cloud.database();
    var openid = wx.getStorageSync('openid');
    console.log('id :' + openid)
    db.collection('car').where({
      _openid: openid
    }).orderBy('createTime','desc').get({

    success:function(res){

  
      that.setData({

       results: res.data
     })

      console.log("res :" + JSON.stringify(res.data))

 }


    })


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


  
    wx.login({

      //获取code
      success: function (res) {
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
            fail: function () {
              //获取用户信息失败后。请跳转授权页面
              wx.showModal({
                title: '授权登陆',
                content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
                success: function (res) {
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
      fail: function () {
        //获取用户信息失败后。请跳转授权页面
        wx.showModal({
          title: '警告',
          content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
          success: function (res) {
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
  onUpdateUserInfo: function (data) {


    util.Requests_json(util.getBaseUrl() + API_USER_UPDATE, data)
      .then((res) => {

      })

  },

  onTop:function(e){

 wx.showToast({
  title: '请下载app',
  })

  },
  
  onPublish:function(){

  

wx.navigateTo({
  url: '../carp/common'
})

  },

  onClear:function(e){
    var that = this;
    // 取得下标
    var index = parseInt(e.currentTarget.dataset.index)


    // 取出id值
    var objectId = that.data.results[index]._id

    const db = wx.cloud.database();

    db.collection('car').doc(objectId).remove({

      success: function (res) {
        wx.showToast({
          title: '删除成功',
        })

      
      that.onLoad()
      }
    })
    
  },

  onCarDetail:function(e){

    var that = this;
    // 取得下标
    var index = parseInt(e.currentTarget.dataset.index);

  
    // 取出id值
    var objectId = that.data.results[index]._id;

    console.log('id :' + objectId + ",index:" + index)

    wx.navigateTo({
      url: '../carinfo/common?carid=' + objectId
    })
  },



  readDetail:function(e){

    var id = e.currentTarget.dataset.id;
    console.log('id : ' + id);

    wx.navigateTo({
      url: '../pseron/common?id=' + id 
    })

  }
    

})