//获取应用实例
const app = getApp()
const util = require('../../utils/api.js')
const utilTime = require('../../utils/util.js')
const API_USER_UPDATE = '/customer/profile/' //更改用户信息

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

    this.getUserInfo();

    console.log('user:' + this.data.userInfo);
  },//完善用户信息
  getUserInfo: function (data) {


    util.Requests(util.getBaseUrl() + API_USER_UPDATE, data)
      .then((res) => {

        this.setData({

          userInfo: res.data,
    
        })
      })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  onInfo:function(){


wx.navigateTo({
  url: '../info/common',
})

  }, onWhoSeeMe:function(e){

    wx.navigateTo({
      url: '../see/common',
    })
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
  onShareAppMessage: function () {
    
  }
})