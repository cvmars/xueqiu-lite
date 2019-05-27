//logs.js

const app = getApp()
const util = require('../../utils/api.js')
const timeUtils = require('../../utils/util.js')
const API_CAR_LIST = '/customer/service-car/' //
const API_LOGIN = '/customer/u/login_miniprogram/' //
const API_USER_UPDATE = '/customer/u/profile/' //


Page({
  data: {
    results: [],
    times:[],
    userInfo: {},
    openid:'',
    showLogin:false,
    carType: ['车找人', '人找车'],
    carRang: ['县内拼车', '市内拼车', '省内拼车', '跨省拼车'],
    curPage : 1,
    car_type_str:'全部',
    totalCount: 100,
    pageSize: 4,
    mCurPage: 1,
    range_type:'',
    searchKeyfrom:'',
    searchKeyto: '',
    shareInfo:{},
    car_service_type:'',
    orderStr:'-update_at',
    orderCarStr: '按发布时间排序',
    carData:[],

    avator:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=179882489,2671999502&fm=111&gp=0.jpg'

  },
 
  onAll:function(e){


    let data = {};
    this.setData({
      mCurPage: 1,
      car_service_type: '',
      car_type_str:'全部',
      range_type:''
    })
    data['page'] = this.data.mCurPage
    this.getCarList(data)
  },

  onCarP: function (e) {


    let data = {};
    this.setData({
      mCurPage: 1,
      car_service_type: 1,
      car_type_str: '车找人',
      range_type:''
    })
    data['page'] = this.data.mCurPage
    this.getCarList(data)
  },

  onPCar: function (e) {

    let data = {};
    this.setData({
      mCurPage: 1,
      car_service_type: 2,
       car_type_str: '人找车',
      range_type:''
    })
    data['page'] = this.data.mCurPage

    this.getCarList(data)
  },


  onCarShi: function (e) {

    let data = {};
    this.setData({
      mCurPage: 1,
      car_service_type: '',
      car_type_str: '市内拼车',
      range_type:'1'
    })
    data['page'] = this.data.mCurPage
    this.getCarList(data)
  },


  onCarXian: function (e) {

    let data = {};
    this.setData({
      mCurPage: 1,
      car_service_type: '',
      car_type_str: '县内拼车',
      range_type:0
    })
    data['page'] = this.data.mCurPage
    this.getCarList(data)
  },




  onInputFrom: function (e) {
    var val = e.detail.value;
    this.setData({
      searchKeyfrom: val
    });
  },

  onInputTo: function (e) {
    var val = e.detail.value;
    this.setData({
      searchKeyto: val
    });
  },

  onUpdataInfo:function(option){

   let that = this;
    util.Requests_json(util.getBaseUrl() + API_USER_UPDATE, option).then((res) => {

    })
  },
  getUserInfo: function (e) {
    console.log("helo" + e)
    app.globalData.userInfo = e.detail.userInfo
    let that = this
    console.log("userinfo : " + JSON.stringify( e.detail.userInfo))
    this.setData({
      userInfo: e.detail.userInfo
    })
    

    wx.setStorageSync('useinfo'  , e.detail.userInfo)
    this.setData({

      showLogin: false
    })

    wx.login({
      //获取code
      success: function (res) {
        var code = res.code //返回code
        console.log("code :" + code);
        let data = {
          code: code
        }
        util.Requests_json(util.getBaseUrl() + API_LOGIN, data).then((res) => {

       
          that.onLoad()
        
        })
      }
      })
  }, 
  
  onChangeOrder:function(e){

    if (this.data.orderStr == "-start_at"){

this.setData({

  orderStr: '-update_at',
  orderCarStr: '按出发时间排序',
})

    }else{

      this.setData({

        orderStr: '-start_at',
        orderCarStr: '按发布时间排序',
      })

    }

    let data = {};
    this.setData({
      mCurPage: 1,
    })
    data['page'] = this.data.mCurPage
    this.getCarList(data)
  },

  //获取店铺列表
  getCarList: function (option) {

    let that = this;
    let data = option
    data['area_from_text__contains'] = this.data.searchKeyfrom
    data['area_to_text__contains'] = this.data.searchKeyto
    data['car_service_type'] = this.data.car_service_type
    data['range_type'] = this.data.range_type
    data['ordering'] = this.data.orderStr
    
    console.log("page :" + option['page'] + "type :" +    this.data.range_type) 
    util.Requests(util.getBaseUrl() + API_CAR_LIST, data).then((res) => {


      if (that.data.mCurPage == 1){

       that.setData({

         carData : []
       })
      }

     let resTemp = this.data.carData

        for (var i = 0; i < res.data.results.length; i++) {
          var item = res.data.results[i];
      
          that.friendTime(item)
          that.friendTime2(item)
          that.carTime(item)
          resTemp.push(item)
      }
  
      that.setData({

        carData: resTemp
      })
      console.log("data" + that.data.carData)
    })
  },

  carTime(item){

    item.carType = this.data.carType[parseInt(item.car_service_type) - 1]
    item.carrang = this.data.carRang[parseInt(item.range_type)]
  },

  friendTime(item){

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
      if (nextTime < 60*60){
        item.friendCreateTime =   parseInt((nextTime / 60) + 1) +"分钟前";
      } else if (nextTime < 24 * 60 && nextTime > 60*60){

        item.friendCreateTime = (parseInt(nextTime / (24*60)) + 1) + "小时前"

      }else{
        var friendTime = timeUtils.formatTimeTwo(oldTime, 'M-D h:m');
        item.friendCreateTime = friendTime;
      }
  
    } else {
      var friendTime = timeUtils.formatTimeTwo(oldTime, 'M-D h:m');
      item.friendCreateTime = friendTime;
    }
  },

  onLoad: function (options) {



    let data = {};

    this.setData({

      mCurPage : 1
    })
    data['page'] = this.data.mCurPage

    this.getCarList(data);

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



      let data = {}
      data['name'] = this.data.userInfo.nickName;
      data['gender'] = this.data.userInfo.avatarUrl;
      data['age'] = 18
      data['avatar_url'] = this.data.userInfo.gender;
      this.onUpdataInfo(data);

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
  
    // this.getOpenid()     
  },

  onReachBottom:function(e){

    let data = {};
    var page = this.data.mCurPage + 1
    this.setData({
      mCurPage: page
    })
    data['page'] = page
   
    this.getCarList(data)
  },

  //完善用户信息
  onUpdateUserInfo: function (data) {


    util.Requests_json(util.getBaseUrl() + API_USER_UPDATE, data)
      .then((res) => {

      })

  },

  onSearch:function(){

    let data = {};
    this.setData({
      mCurPage :1
    })
    data['page'] = this.data.mCurPage
    
    this.getCarList(data)

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
    var objectId = that.data.carData[index].id;

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