const app = getApp()
const util = require('../../utils/api.js')
const API_LOGIN = '/api/customers/login_miniprogram/' //登录接口
const API_USER_UPDATE = '/customer/profile/' //修改用户信息
const API_POST_PIAOLIU = '/api/bottles-mine/' //抛出漂流瓶
const API_GET_PIAOLIU = '/api/bottles/pickone/' // 捡漂流瓶
const API_QINIU_TOKEN = '/token/' //七牛token


Page({

  /**
   * 页面的初始数据
   */
  data: {
    images:[],
    loadToken:'',
    headload:'',
    ceshi: '',
    topicid:'',
    imgUrl:'',
    count:0,
    cloudImg:'',
    showLogin:false,
    userInfo:{}
  },
  doUpload: function () {
    // 选择图片
    var that = this;
    var timestamp = Date.parse(new Date());

    this.setData({
      count : timestamp
    })

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        that.setData({
          imgUrl: filePath,
          headload:filePath
        })
        // 上传图片
        const cloudPath = that.data.count + filePath.match(/\.[^.]+?$/)[0]

        console.log(cloudPath)

        // filePath.forEach((item, i) => {
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res.fileID, res)
 

            that.setData({

              cloudImg: res.fileID
            })

          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
        // })

      },
      fail: e => {
        console.error(e)
      }
    })
  },


    bindTextAreaBlur: function(e) {
      this.setData({
        ceshi: e.detail.value
      })
  },
  getUserInfo: function (e) {
   
  
    this.setData({
      userInfo: e.detail.userInfo,
    })
    wx.setStorageSync('useinfo', e.detail.userInfo)
    this.setData({

      showLogin: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var shopid = options.topicid
    console.log('topicidsss :' + shopid)

    var userinfo = wx.getStorageSync('useinfo')

if(userinfo == ""){

  this.setData
  ({
      showLogin: true
  })
}
    this.setData({

      userInfo: userinfo

    })
     
    console.log("userinfo : " + JSON.stringify(this.data.userinfo))

    this.setData({
      topicid:shopid
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

    const db = wx.cloud.database()

    let that = this
    var timestamp = Date.parse(new Date())

    console.log('cloudImg :' + that.data.cloudImg)

    if (this.data.ceshi == '') {
      wx.showToast({
        title: '请输入内容'
      });
      return;
    }

    if (this.data.cloudImg == '') {
      wx.showToast({
        title: '请添加图片'
      });
      return;
    }

    if (this.data.userinfo == "") {

    this.setData({

      showLogin: true
    })

     true;
   
    }

    console.log("nickname :" + that.data.userInfo.nickName)
 
    db.collection('find').add({
      
      data: {
        topic_id: that.data.topicid,
        topic_content:that.data.ceshi,
        topic_img:that.data.cloudImg,
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
    let that = this;
    return {
      title: '莲花雪球论坛',
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