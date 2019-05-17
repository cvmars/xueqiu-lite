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
    userInfo: {},
    openid:'',
    showLogin:false,

    totalCount: 100,
    pageSize: 4,
    mCurPage: 1,
    imgUrls: [
      'https://6c69-lianhua-82fcb3-1253553185.tcb.qcloud.la/ic_launcher.png',
      'https://6c69-lianhua-82fcb3-1253553185.tcb.qcloud.la/ic_launcher.png',
      'https://6c69-lianhua-82fcb3-1253553185.tcb.qcloud.la/ic_launcher.png',
      'https://6c69-lianhua-82fcb3-1253553185.tcb.qcloud.la/ic_launcher.png',
      'https://6c69-lianhua-82fcb3-1253553185.tcb.qcloud.la/ic_launcher.png'
    ],
    shareInfo:{}

  },
  getUserInfo: function (e) {
    console.log("helo" + e)
    app.globalData.userInfo = e.detail.userInfo

    console.log("userinfo : " + JSON.stringify( e.detail.userInfo))
    this.setData({
      userInfo: e.detail.userInfo
    })
    wx.setStorageSync('useinfo'  , e.detail.userInfo)
    this.setData({

      showLogin: false
    })
  }, // 获取用户openid
  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        console.log('云函数获取到的openid: ', res.result)
        var openid = res.result.openId;
        that.setData({
          openid: openid
        })
        console.log('openid :' + openid )
        wx.setStorageSync('openid', openid);
      }
    })
  },

  onLoad: function (options) {



    var that = this
 
    var user = wx.getStorageSync('useinfo')
    
    console.log('info :' + JSON.stringify(user))

    that.setData({

      userInfo: user,
      mCurPage: 1
    })

    if (this.data.userInfo == "") {

      that.setData({

        showLogin: true
      })

      
    }else{


      if (options){

        var shareType = options.share;

        //分享跳转到小程序
        if (shareType == 1) {
          var objectId = options.carid;
          wx.navigateTo({
            url: '../carinfo/common?carid=' + objectId
          })
        } else if (shareType == 2) {
          var objectId = options.topic;
          wx.navigateTo({

            url: '../topicd/common?topicid=' + objectId,
          })
        } else if (shareType == 3) {
          var objectId = options.product;
          wx.navigateTo({
            url: '../pdetail/common?shopid=' + objectId,

          })
        }
      }

      
    }



    wx.cloud.init({
      env: 'lianhua-82fcb3',
       traceUser : true})
  
    this.getOpenid()


    const db = wx.cloud.database();


    // 获取分享的信息
    db.collection('share').get({
      success: function (res) {
        that.setData({

          shareInfo: res.data[0]

        })
        console.log("shareInfo :" + res.data[0] +  that.data.shareInfo)
      }
    })


    // 获取总数
    db.collection('car').count({
      success: function (res) {
        that.setData({

          totalCount: res.totalCount

        })

        console.log("count :" + that.data.totalCount)
      }
    })



    db.collection('car').orderBy('createTime', 'desc').limit(that.data.pageSize).get({

    success:function(res){


      for (var i = 0; i < res.data.length; i++) {
        var tempTopic = res.data[i];
        var request_time = tempTopic.createTime;
        var oldTime = request_time / 1000;
        console.log('time :' + oldTime)
        var friendTime = timeUtils.formatTimeTwo(oldTime, 'M-D h:m');
        tempTopic.friendTime = friendTime;
      }

      that.setData({

       results: res.data
     })

      console.log("res :" + JSON.stringify(res.data))
 }
    })
     
  },

  onReachBottom:function(e){


    var that = this;
    var temp = [];
    const db = wx.cloud.database()
    db.collection('car').orderBy('createTime', 'desc').skip(this.data.pageSize * this.data.mCurPage).where({
      topic_id: that.data.shopid
    }).get({

      success: function (res) {

        var page = that.data.mCurPage + 1

        that.setData({
          mCurPage: page
        })

        for (var i = 0; i < res.data.length; i++) {
          var tempTopic = res.data[i];

          var request_time = tempTopic.createTime;
          var oldTime = request_time / 1000;
          console.log('time :' + oldTime)
          var friendTime = timeUtils.formatTimeTwo(oldTime, 'M-D h:m');
          tempTopic.friendTime = friendTime;
          temp.push(tempTopic);
        }


       


        var totalTopic = {};
        totalTopic = that.data.results.concat(temp);

        that.setData({

          results: totalTopic
        })
        console.log('info :' + JSON.stringify(that.data.results))
      },

      error: function (e) {

        console.log('error')
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

  },
  /**
   * 用户点击右上角分享
   */
  /**
    * 用户点击右上角分享
    */
  onShareAppMessage: function () {
    let that = this;
    return {
      title: that.data.shareInfo.share_title,
      imageUrl: that.data.shareInfo.share_url,
      path: '/pages/car/logs',
      // imageUrl: '../../image/bg_piaoliu_share.png',
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }

})