// pages/pseron/common.js

const util = require('../../utils/api.js')
const timeUtils = require('../../utils/util.js')
const API_LAST_PERSON = '/customer/' //个人主页


Page({

  /**
   * 页面的初始数据
   */
  data: {

    user: {},
    userid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    console.log("options :" + options.id)
    this.getLastPerson(options.id);
    // this.setData({

    //   userid = options.id
    // })
    let that = this;
    that.setData({
      userid: options.id
    })

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
      title: '请下载app',
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
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {

    let that = this;
    //右上角分享
    return {
      title: '我在莲花雪球的等你',
      path: 'pages/pseron/common?id=' + that.data.userid,
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