//获取应用实例
const app = getApp()
const util = require('../../utils/api.js')
const timeUtils = require('../../utils/util.js')
const API_GET_EXITAPP = '/moments/topic/' //用户话题列表


Page({

  /**
   * 页面的初始数据
   */
  data: {
    releaseFocus: false,
    results:[],
    user:'',
    shopid:'',
    content:'',
    userInfo:{},
    showLogin:false
  }, 
  
  getUserInfo: function (e) {

    this.setData({
      userInfo: e.detail.userInfo,
    })
    wx.setStorageSync('useinfo', e.detail.userInfo)
    this.setData({

      showLogin: false
    })
  },
  
  bindTextAreaBlur: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  
  onComment :function(){

    if (this.data.content == '') {
      wx.showToast({
        icon:'',
        title: '请输入内容'
      });
      return;
    }

  let that = this;
    console.log("nickname :" + that.data.userInfo.nickName)
    const db = wx.cloud.database()

    var timestamp = Date.parse(new Date())
    db.collection('findcomment').add({

      data: {
        findid: that.data.shopid,
        findcontent: that.data.content,
        createTime: timestamp,
        createName: that.data.userInfo.nickName,
        createAvator: that.data.userInfo.avatarUrl
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count: 1,
          content:''
        })

        wx.showToast({
          title: '提交成功',
        });
       
          //关键在这里
        this.getCommentList()
    
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })

  },

  getCommentList:function(){

    const db = wx.cloud.database()

    let that = this;

    db.collection('findcomment').orderBy('createTime', 'desc').where({
      findid: that.data.shopid
    }).get({

      success: function (res) {


        if (res.data) {

          for (var index in res.data) {

            var request_time = res.data[index].createTime;
            var oldTime = request_time / 1000;
            console.log('time :' + oldTime)
            var friendTime = timeUtils.formatTimeTwo(oldTime, 'M-D h:m');
            res.data[index].friendTime = friendTime;
          }

        }
        // this.setData({
        //   result: res.data
        // })

        that.setData({

          results: res.data
        })
        console.log("res :" + JSON.stringify(res.data))
      }
    })
  },

 

  onPublish: function () {

    let that = this;
    console.log('topic :' + that.data.shopid)
    wx.navigateTo({
      url: '../topicp/common?topicid=' + that.data.shopid,
    })

  },
   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
     * 点击回复
     */
  bindReply: function (e) {
    this.setData({
      releaseFocus: true
    })
  },

  onDetail: function (e) {

    wx.navigateTo({
      url: '../pdetail/common',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  


    var userinfo = wx.getStorageSync('useinfo')

    if (userinfo == "") {

      this.setData
        ({
          showLogin: true
        })
    }
    this.setData({

      userInfo: userinfo

    })

  

    var shopid

    if(options){
      shopid = options.findid
    }

    console.log('findid :' + shopid)

   
  
  

    const db = wx.cloud.database()

    let that = this;

    if(shopid){
    this.setData({
      shopid: shopid
    })
    }

    this.getCommentList()

    db.collection('find').where({
      _id: that.data.shopid
    }).get({

      success: function (res) {

        that.setData({

          user: res.data[0]
        })
        console.log("res :" + JSON.stringify(res.data))
      }
    })

    // db.collection('topic').where({
    //   topic_id: that.data.shopid
    // }).get({

    //   success: function (res) {
    //     console.log('success')
    //     that.setData({

    //       carinfo: res.data[0]
    //     })
    //     console.log('info :' + JSON.stringify(that.data.carinfo))
    //   },

    //   error: function (e) {

    //     console.log('error')
    //   }
    // })
  },

  //完善用户信息
  onUpdateUserInfo: function (data) {


    util.Requests(util.getBaseUrl() + API_GET_EXITAPP, data)
      .then((res) => {


      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

 

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})