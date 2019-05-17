//获取应用实例
const app = getApp()
const util = require('../../utils/api.js')
const API_GET_EXITAPP = '/moments/topic/' //用户话题列表


Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    results:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

    let that = this;

    const db = wx.cloud.database();

    db.collection('topic').get({

      success: function (res) {


        that.setData({

          results: res.data
        })
        console.log("res :" + JSON.stringify(res.data))
  }
    })


   
    
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  onDetail:function(e){

    var that = this;
    // 取得下标
    var index = parseInt(e.currentTarget.dataset.index);

    console.log("index:" + index)
    // 取出id值
    var objectId = that.data.results[index].topic_id;

    console.log('id :' + objectId + ",index:" + index)

wx.navigateTo({
  url: '../topicd/common?topicid=' + objectId,
})
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