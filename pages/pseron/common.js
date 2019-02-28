// pages/pseron/common.js

const util = require('../../utils/api.js')
const timeUtils = require('../../utils/util.js')
const API_LAST_PERSON = '/customer/' //个人主页


Page({

  /**
   * 页面的初始数据
   */
  data: {

    user: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    console.log("options :" + options.id)
    this.getLastPerson(options.id);
  },
  getLastPerson: function(e) {

    let that = this;
    let data = {}
    util.Requests(util.getBaseUrl() + API_LAST_PERSON + e + '/', data)
      .then((res) => {

        that.setData({
          user: res.data
        })
      })
  },

  sendWx: function(e) {
    wx.showToast({
      title: '索要微信',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})