Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    carinfo:{},
    carid:'',
    hiddenHome:true,
    userInfo:{},
    showLogin:''
  },
  getUserInfo: function (e) {
    console.log("helo" + e)
    app.globalData.userInfo = e.detail.userInfo

    console.log("userinfo : " + JSON.stringify(e.detail.userInfo))
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      showLogin: false
    })
    wx.setStorageSync('useinfo', e.detail.userInfo)

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var objectId = options.carid
    console.log('carid :' + objectId)

var share = options.share;

if(share == 1){

  this.setData({

    hiddenHome : false
  })
}
    const db = wx.cloud.database()


    var that = this

    var user = wx.getStorageSync('useinfo')

    console.log('info :' + JSON.stringify(user))

    that.setData({

      userInfo: user,
  
    })

    if (this.data.userInfo == "") {

      that.setData({

        showLogin: true
      })
    }



    that.setData({
      carid: objectId
    })

    db.collection('car').where({
      _id: objectId
    }).get({

      success: function (res) {
        console.log('success')
        that.setData({

          carinfo: res.data[0]
        })
        console.log('info :' + JSON.stringify(that.data.carinfo))
      },

      error :function(e){

        console.log('error')
      }

      
       
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

  publish:function(){

wx.showToast({
  title: '提交成功',
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

  backHome:function(e){

wx.navigateTo({
  url: '../car/logs'
})

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
   
    let that = this;
    return {
      title: '莲花拼车',
      path: '/pages/car/logs?carid=' + that.data.carid +"&share=1",
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
