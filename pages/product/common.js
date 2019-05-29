
const app = getApp()
const util = require('../../utils/api.js')
const timeUtils = require('../../utils/util.js')
const API_SHOP = '/customer/store/' //店铺列表
const API_PRODUCT = '/customer/product/' //产品列表
const API_HOME_BANNER = '/customer/ad/homepage/' //banner数据


const API_POST_PIAOLIU = '/api/bottles-mine/' //抛出漂流瓶
const API_GET_PIAOLIU = '/api/bottles/pickone/' // 捡漂流瓶
const API_GET_EXITAPP = '/customer/logout/' //退出登录


Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    results:[],
    shopData:[],
    productData: [],
    bannerData:[],
  
    current: 0,
    animationData: {},
    animationData2: {}
  },

  onAD:function(e){
 
    var index = parseInt(e.currentTarget.dataset.index);
    // 取出id值
    var objectId = this.data.bannerData[index].resource_str;

    var ad_type = this.data.bannerData[index].ad_type



    var strUrl = ''

    if(ad_type == 0){

      strUrl = "../web/common?id="
      // objectId = '1'
 
     
    }else if(ad_type == 1){

      strUrl = "../pdetail/common?id="
    } else if (ad_type == 2) {

      strUrl = "../pppdetail/common?id="
    } else if (ad_type == 4) {

      strUrl = "../topicd/common?topicid="
    } else if (shareType == 5) {
      strUrl = "../video/common?id="
    }
     
    wx.navigateTo({

      url: strUrl + objectId

    })


  },
  onProductList:function(){


wx.navigateTo({
  url: '../plist/common?id=1',
})

  },

  onProductList2: function () {


    wx.navigateTo({
      url: '../plist/common?id=2',
    })

  },

  onProductList3: function () {


    wx.navigateTo({
      url: '../plist/common?id=3',
    })

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

    this.getShop();
    this.getProduct(); 
    this.getBanner();
  },


//获取店铺列表
  getShop:function(){

let that = this;
let data = {}
    util.Requests(util.getBaseUrl() + API_SHOP, data).then((res) => {
     

      that.setData({

        shopData : res.data.results
      })
    console.log("data"+ that.data.shopData)
    })
  },


  //获取店铺列表
  getProduct: function () {

    let that = this;
    let data = {}
    util.Requests(util.getBaseUrl() + API_PRODUCT, data).then((res) => {


      //  let products = [];

      for (var i = 0; i < res.data.results.length; i++) {

        var tempTopic = res.data.results[i];

        tempTopic.img = tempTopic.images[0];
      }
      that.setData({

        productData: res.data.results
      })
      console.log("data" + that.data.productData)
    })
  },

  //获取店铺列表
  getBanner: function () {

    let that = this;
    let data = {}
    util.Requests(util.getBaseUrl() + API_HOME_BANNER, data).then((res) => {

      that.setData({

        bannerData: res.data.results
      })
      console.log("data" + that.data.bannerData)
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

//商品详情
  onProductDetail:function(e){


    var index = parseInt(e.currentTarget.dataset.index);


    // 取出id值
    var objectId = this.data.productData[index].id;



 wx.navigateTo({
  
   url: "../pppdetail/common?id=" + objectId

 })


  },

  onShop:function(e){

    var that = this;
    // // 取得下标
    var index = parseInt(e.currentTarget.dataset.index);

    console.log("index:" + index)
    // 取出id值
    var objectId = that.data.shopData[index].id;

    console.log('id :' + objectId + ",index:" + index)


    wx.navigateTo({
      url: '../pdetail/common?id=' + objectId,
    })
  },

  onCar: function () {

    wx.navigateTo({
      url: '../car/logs',
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
    
    this.onLoad()
    wx.stopPullDownRefresh()
  },

  onDetail:function(e){


    var that = this;
    // 取得下标
    var index = parseInt(e.currentTarget.dataset.index);

    console.log("index:" + index)
    // 取出id值
    var objectId = that.data.shopData[index].id;

    console.log('id :' + objectId + ",index:" + index)


wx.navigateTo({
  url: '../pdetail/common?id=' + objectId,
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