//获取应用实例
const app = getApp()
const util = require('../../utils/api.js')
const utilTime = require('../../utils/util.js')
const API_USER_UPDATE = '/customer/profile/' //更改用户信息
const API_SEE_STATUS = '/api/demands/unread/' //更改用户信息
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    userInfo:{},
    numberSee : true,
    numSee:0,
    shareInfo: {}
  },
  onCar:function(){

    wx.navigateTo({
      url: '../carm/logs',
    })

  },

  onShare: function(e){

    wx.showShareMenu()

  },
  zeou: function (e) {

    wx.navigateTo({
      url: '../zeou/common',
    })
  },

  renzhen: function (e) {

    wx.navigateTo({
      url: '../renzhen/common',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {


    var user = wx.getStorageSync('useinfo')

    console.log("userinfo : " + JSON.stringify(user))
  

     this.setData({

       userInfo : user
     })
   
    const db = wx.cloud.database();


   let that = this;

    // 获取分享的信息
    db.collection('share').get({
      success: function (res) {
        that.setData({

          shareInfo: res.data[0]

        })
        console.log("shareInfo :" + res.data[0] + that.data.shareInfo)
      }
    })


    console.log('user:' + JSON.stringify(this.data.userInfo));
  },//完善用户信息

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var user = wx.getStorageSync('useinfo')

    console.log("userinfo : " + JSON.stringify(user))

    this.setData({

      userInfo: user
    })
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
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