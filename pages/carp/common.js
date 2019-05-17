Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['江西省', '萍乡市', '莲花县'],
    out_address1:'',
    out_address2: '',
    order_address1: '',
    order_address2: '',
    car_time:'',
    car_number:'',
    car_name:'',
    car_phone:'',
    car_about :'',
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

  publish: function (e) {

  let that = this;
    console.log("out_address2 :" + this.data.out_address2)
    if (this.data.out_address1 == ''){
      wx.showToast({
        title: '请选择出发城市'
      });
      return;
    }

    if (this.data.order_address1 == '') {
      wx.showToast({
        title: '请选择目的地城市'
      });
      return;
    }

    if (this.data.car_time == '') {
      wx.showToast({
        title: '请选择出发时间'
      });
      return;
    }

    if (this.data.car_number == '') {
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
    
    const db = wx.cloud.database()

    var timestamp = Date.parse(new Date());
    db.collection('car').add({
      data: {
        car_out_address1: that.data.out_address1,
        car_out_address2: that.data.out_address2,
        car_order_address1: that.data.order_address1,
        car_order_address2: that.data.order_address2,
        car_time: that.data.car_time,
        car_number: that.data.car_number,
        car_name: that.data.car_name,
        car_phone: that.data.car_phone,
        car_about: that.data.car_about,
        createTime: timestamp,
        createName: that.data.userInfo.nickName,
        createAvator: that.data.userInfo.avatarUrl
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count: 1
        })
       
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
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
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