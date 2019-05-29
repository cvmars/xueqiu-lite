//logs.js

const app = getApp()
const util = require('../../utils/api.js')
const timeUtils = require('../../utils/util.js')
const API_CAR_LIST = '/customer/my/service-car/' //


Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['江西省', '萍乡市', '莲花县'],
    carType: ['车找人', '人找车'],
    carRang: ['县内拼车', '市内拼车', '省内拼车','跨省拼车'],
    out_address1:'',
    out_address2: '',
    order_address1: '',
    order_address2: '',
    car_type:'',
    car_type_str:'',
    car_rang: '',
    car_rang_str: '',
    car_item_address:'',
    car_time:'',
    car_number:0,
    car_name:'',
    car_phone:'',
    car_about :'',
    car_hidden: false,
    userInfo:'',
    customItem: '请选择', //为每一列的顶部添加一个自定义的项
    order_address1:'',
    carid:'',
    showLogin:''
  }, getUserInfo: function (e) {

    this.setData({
      userInfo: e.detail.userInfo,
    })
    wx.setStorageSync('useinfo', e.detail.userInfo)
    this.setData({

      showLogin: false
    })
  },

  //获取店铺列表
  onPublish: function () {

    let that = this;
    console.log("out_address2 :" + this.data.out_address2)

    if (this.data.car_type_str == '') {
      wx.showToast({
        title: '请选择拼车类型'
      });
      return;
    }

    if (this.data.car_rang_str == '') {
      wx.showToast({
        title: '请选择拼车范围'
      });
      return;
    }


    if (this.data.out_address2 == '') {
      wx.showToast({
        title: '请输入出发城市'
      });
      return;
    }

    if (this.data.order_address2 == '') {
      wx.showToast({
        title: '请输入目的地城市'
      });
      return;
    }

    if (this.data.car_time == '') {
      wx.showToast({
        title: '请选择出发时间'
      });
      return;
    }

    if (this.data.car_type != 1 && this.data.car_number == '') {
      wx.showToast({
        title: '请输入剩余位置'
      });
      return;
    }




    if (this.data.car_phone == '') {
      wx.showToast({
        title: '请输入联系电话'
      });
      return;
    }


    let data = {

      car_service_type: parseInt(that.data.car_type) + 1,
      area_from_text: that.data.out_address2,
      area_to_text: that.data.order_address2,
      place_pass:that.data.car_item_address,
      start_at: that.data.car_time,
      tel: that.data.car_phone,
      site_count: that.data.car_number,
      mark: that.data.car_about,
      range_type:parseInt(that.data.car_rang),
      published: true,

      }
      
    util.Requests_json(util.getBaseUrl() + API_CAR_LIST, data).then((res) => {

      wx.showToast({
        title: '提交成功',
      });
      var pages = getCurrentPages(); // 当前页面
      var beforePage = pages[pages.length - 2]; // 前一个页面
      if (pages.length > 1) {
        //上一个页面实例对象
        var prePage = pages[pages.length - 2];
        //关键在这里
        prePage.onLoad()
      }
      wx.navigateBack({

      });
    
    })
  },


  bindTypeChange:function(e){
    this.setData({
      car_type: e.detail.value,
      car_type_str: this.data.carType[e.detail.value]
    })

    if(e.detail.value == 1){

      this.setData({
        car_hidden: true,
    
      })
    }else{

      this.setData({
        car_hidden: false,
      })
    }
  },

  bindRangChange: function (e) {
    this.setData({
      car_rang: e.detail.value,
      car_rang_str: this.data.carRang[e.detail.value]
    })
  },


  bindDateChange:function(e){

    this.setData({
      car_time: e.detail.value
    })
  },
  getCarName: function (e) {
    var val = e.detail.value;
    this.setData({
      car_name: val
    });
  },
  getCarPhone: function (e) {
    var val = e.detail.value;
    this.setData({
      car_phone: val
    });
  },
  getCarAbout: function (e) {
    var val = e.detail.value;
    this.setData({
      car_about: val
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    var userinfo = wx.getStorageSync('useinfo')

    if (userinfo == "") {

      this.setData
        ({
          showLogin: true
        })
    }
    this.setData({

      userInfo: userinfo

    })

  }, 
  
  bindRegionChange: function (e) {
    console.log('bindRegionChange picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value,
      out_address1: e.detail.value[0] + " " + e.detail.value[1] + " " + e.detail.value[2]
    })

  },

  bindRegionChange2: function (e) {
    console.log('bindRegionChange picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value,
      order_address1: e.detail.value[0] + " " + e.detail.value[1] + " " + e.detail.value[2]
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

  
  getItemAddress: function (e) {
    var val = e.detail.value;
    this.setData({
       car_item_address: val
    });
  },




  getOutAddress2: function (e) {
    var val = e.detail.value;
    this.setData({
      out_address2: val
    });
  },

  getOrderAddress2: function (e) {
    var val = e.detail.value;
    this.setData({
      order_address2: val
    });
  },
  getCarNumber: function (e) {
    var val = e.detail.value;
    this.setData({
      car_number: val
    });
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