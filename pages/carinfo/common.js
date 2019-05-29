const app = getApp()
const util = require('../../utils/api.js')
const timeUtils = require('../../utils/util.js')
const API_MY_CAR = '/customer/service-car/' //我的拼车


Page({

  /**
   * 页面的初始数据
   */
  data: {
    carType: ['车找人', '人找车'],
    carRang: ['县', '市', '省', '国'],
    carinfo:{},
    carid:'',
    hiddenHome:true,
    userInfo:{},
    avator: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=179882489,2671999502&fm=111&gp=0.jpg',
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

  getCarInfo: function (option){

    let that = this;
    let data = {}
    util.Requests(util.getBaseUrl() + API_MY_CAR + option, data).then((res) => {


      var tempInfo = res.data;
      that.carTime(tempInfo)
      that.friendTime(tempInfo)
      that.friendTime2(tempInfo)

     that.setData({

       carinfo: tempInfo

     })

    })
  },


  carTime(item) {

    item.carType = this.data.carType[parseInt(item.car_service_type) - 1]
    item.carrang = this.data.carRang[parseInt(item.range_type)]

    if (parseInt(item.car_service_type) == 1) {

      item.carTypeColor = '#F8B864'
    } else {
      item.carTypeColor = '#FF494B'
    }


    if (parseInt(item.range_type) == 0) {

      item.carRangColor = '#5195FF'
    } else if (parseInt(item.range_type) == 1) {
      item.carRangColor = '#25CCBC'
    } else if (parseInt(item.range_type) == 2) {
      item.carRangColor = '#9972F1'
    } else {
      item.carRangColor = '#FF494B'
    }
  },

  friendTime(item) {

    var request_time = item.start_at;
    request_time = request_time.substring(0, 19);
    request_time = request_time.replace(/-/g, '/');
    var timestamp = new Date(request_time).getTime();
    var oldTime = timestamp / 1000;


    var curTime = new Date().getTime() / 1000;

    if (oldTime < curTime && curTime - oldTime < 24 * 60 * 60) {
      item.friendTime = "今天";
    } else if (oldTime > curTime && oldTime - curTime < 24 * 60 * 60) {

      item.friendTime = "明天";
    } else if (oldTime - curTime >= 24 * 60 * 60 && oldTime - curTime < 24 * 60 * 60 * 2) {

      item.friendTime = "后天";
    } else {
      var friendTime = timeUtils.formatTimeTwo(oldTime, 'M-D');
      item.friendTime = friendTime;
    }
  },

  friendTime2(item) {

    var request_time = item.create_at;
    request_time = request_time.substring(0, 19);
    request_time = request_time.replace(/-/g, '/');
    var timestamp = new Date(request_time).getTime();
    var oldTime = timestamp / 1000;


    var curTime = new Date().getTime() / 1000;

    if (oldTime < curTime && curTime - oldTime < 24 * 60 * 60) {

      var nextTime = curTime - oldTime
      if (nextTime < 60 * 60) {
        item.friendCreateTime = parseInt((nextTime / 60) + 1) + "分钟前";
      } else if (nextTime < 24 * 60 && nextTime > 60 * 60) {

        item.friendCreateTime = (parseInt(nextTime / (24 * 60)) + 1) + "小时前"

      } else {
        var friendTime = timeUtils.formatTimeTwo(oldTime, 'M-D h:m');
        item.friendCreateTime = friendTime;
      }

    } else {
      var friendTime = timeUtils.formatTimeTwo(oldTime, 'M-D h:m');
      item.friendCreateTime = friendTime;
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var objectId = options.carid
    console.log('carid :' + objectId)

    this.setData({
      carid: objectId
    })

    this.getCarInfo(objectId);

var share = options.share;

if(share == 1){

  this.setData({

    hiddenHome : false
  })
}
    // const db = wx.cloud.database()


    // var that = this

    // var user = wx.getStorageSync('useinfo')

    // console.log('info :' + JSON.stringify(user))

    // that.setData({

    //   userInfo: user,
  
    // })

    // if (this.data.userInfo == "") {

    //   that.setData({

    //     showLogin: true
    //   })
    // }

  

    // db.collection('car').where({
    //   _id: objectId
    // }).get({

    //   success: function (res) {
    //     console.log('success')
    //     that.setData({

    //       carinfo: res.data[0]
    //     })
    //     console.log('info :' + JSON.stringify(that.data.carinfo))
    //   },

    //   error :function(e){

    //     console.log('error')
    //   }

      
       
    //   })
   
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
