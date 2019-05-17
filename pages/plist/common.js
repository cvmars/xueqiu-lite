Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    results:[],
    imgUrls: [
      'https://6c69-lianhua-82fcb3-1253553185.tcb.qcloud.la/ic_launcher.png',
      'https://6c69-lianhua-82fcb3-1253553185.tcb.qcloud.la/ic_launcher.png',
      'https://6c69-lianhua-82fcb3-1253553185.tcb.qcloud.la/ic_launcher.png',
      'https://6c69-lianhua-82fcb3-1253553185.tcb.qcloud.la/ic_launcher.png',
      'https://6c69-lianhua-82fcb3-1253553185.tcb.qcloud.la/ic_launcher.png'
    ],
    current: 0,
    animationData: {},
    animationData2: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.stretch(350)
    
    var that = this
    
    wx.cloud.init()
  
    const db = wx.cloud.database();

    db.collection('shop').get({

      success: function (res) {

        that.setData({

          results: res.data
        })
        console.log("res :" + JSON.stringify(res.data))
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  change(e) {
    this.setData({
      current: e.detail.current
    })
    this.stretch(350)

    this.shrink(300)
  },
  // 收缩
  stretch(h) {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.height(h).step()
    this.setData({
      animationData: animation.export(),
    })
  },
  // 展开
  shrink(h) {
    var animation2 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation2 = animation2
    animation2.height(h).step()
    this.setData({
      animationData2: animation2.export()
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

  onDetail:function(e){


    var that = this;
    // 取得下标
    var index = parseInt(e.currentTarget.dataset.index);

    console.log("index:" + index)
    // 取出id值
    var objectId = that.data.results[index].shop_id;

    console.log('id :' + objectId + ",index:" + index)


wx.navigateTo({
  url: '../pdetail/common?shopid=' + objectId,
})
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

 

  onShareAppMessage: function (res) {

 
  }

})