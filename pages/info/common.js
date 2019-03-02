//获取应用实例
const app = getApp()
const util = require('../../utils/api.js')
const utilTime = require('../../utils/util.js')
const API_USER_UPDATE = '/customer/profile/' //更改用户信息

Page({

  /**
   * 页面的初始数据
   */
  data: {

    userInfo: {},
    userIntro: '',
    userIntroInput: '',
    addresshome: '', //默认地区
    addressCompany: '',
    userGender: 1, //默认性别
    //普通选择器：（普通数组）

    array: ['男', '女'],

    address_home: ['邯郸市', '邯山区', '丛台区', '复兴区', '峰峰矿区', '肥乡区', '永年区', '临漳县', '成安县', '大名县', '涉县', '磁县', '邱县', '鸡泽县', '广平县', '馆陶县', '魏县', '曲周县','武安市'],
    index: 0, //默认显示位置
    showIntr: false,
    //普通选择器2：（普通json格式数组）
    objectArray: [{
        id: 0,
        name: '中国'
      },
      {
        id: 1,
        name: '美国'
      },
      {
        id: 2,
        name: '德国'
      },
      {
        id: 3,
        name: '法国'
      }
    ],
    objectIndex: 0, //默认显示位置
    //多列选择器：
    multiArray: [
      ['音频', '视频'],
      ['mp3', '评书']
    ], //二维数组，长度是多少是几列
    multiIndex: [0, 0],
    //时间选择器：
    time: '12:01',
    //日期选择器：
    date: '2016-09-01',

    //省市区选择器：
    region: ['请选择', '请选择', '请选择'],
    region1: ['请选择', '请选择', '请选择'],
    customItem: '请选择', //为每一列的顶部添加一个自定义的项
    customItem1: '请选择' //为每一列的顶部添加一个自定义的项

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {

    this.getUserInfo();

    console.log('user:' + this.data.userInfo);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  handleClose: function() {

    this.setData({

      showIntr: false
    })
  },

  onIntro: function() {

    this.setData({

      showIntr: true
    })
  },

  handleConfirm: function(e) {




    this.setData({
      userIntro: this.data.userIntroInput,
      showIntr: false,
      userIntroInput: ''

    })
    console.log("input intro :" + this.data.userIntro)
    let data = {}
    data['intro'] = this.data.userIntro
    this.onUpdateUserInfo(data)

  },

  onInfo: function() {


    wx.navigateTo({
      url: '../info/common',
    })

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

  }, //普通选择器
  bindTextAreaBlur: function(e) {

    //打印结果”是我是一个textarea”
    this.setData({
      userIntroInput: e.detail.value,
    })
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      userGender: parseInt(e.detail.value) + 1
    })

    console.log('userGender :' + this.data.userGender)
    let data = {}
    data['gender'] = this.data.userGender
    this.onUpdateUserInfo(data)
  },
  //家庭地址选择器2：
  addressHomePickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      objectIndex: e.detail.value,
      addresshome: this.data.address_home[e.detail.value]
    })

    let data = {}
    data['address_home'] = this.data.addresshome
    this.onUpdateUserInfo(data)
  },
  //多列选择器：
  bindMultiPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    if (e.detail.column == 0) { //第1列
      if (e.detail.value == 0) { //音频
        this.setData({
          multiArray: [
            ['音频', '视频'],
            ['mp3', '评书']
          ]
        })
      };
      if (e.detail.value == 1) { //视频
        this.setData({
          multiArray: [
            ['音频', '视频'],
            ['电影', '电视剧']
          ]
        })
      };
    };

  },
  //时间选择器：
  // bindTimeChange: function(e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     time: e.detail.value
  //   })


  // },
  //日期选择器：
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })

    let params = {}
    var result = this.fomateTime(this.data.date)
    console.log('params :' + result)
    params['birthday'] = result
    this.onUpdateUserInfo(params)

  },
  //省市区选择器：
  bindRegionChange: function(e) {
    console.log('bindRegionChange picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value,
      addressCompany: e.detail.value[0] + " " + e.detail.value[1] + " " + e.detail.value[2]
    })
    let data = {}
    data['address_company'] = this.data.addressCompany
    this.onUpdateUserInfo(data)
  },

  //省市区选择器：
  bindRegionChange1: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region1: e.detail.value
    })
  },

  //完善用户信息
  onUpdateUserInfo: function(data) {


    util.Requests_json(util.getBaseUrl() + API_USER_UPDATE, data)
      .then((res) => {

      })

  },

  fomateTime: function(data) {

    console.log('time :' + data)

    var time = new Date(data).getTime() / 1000;

    console.log('time :' + time)


    var result = utilTime.formatTimeTwo(time, 'Y-M-D h:m:s')


    console.log('result :' + result)

    return result;
  },


  //完善用户信息
  getUserInfo: function(data) {


    util.Requests(util.getBaseUrl() + API_USER_UPDATE, data)
      .then((res) => {

        this.setData({

          userInfo: res.data,
          addresshome: res.data.address_home,
          userGender: res.data.gender,
          date: res.data.birthday,
          userIntro: res.data.intro,
          addressCompany: res.data.address_company,
        })
      })

  }
})