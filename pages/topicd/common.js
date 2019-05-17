

//获取应用实例
const app = getApp()
const util = require('../../utils/api.js')
const API_GET_EXITAPP = '/moments/topic/' //用户话题列表
const timeUtils = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    results:[],
    carinfo:'',
    shopid:'',
    totalCount:100,
    pageSize:10,
    mCurPage:1
  },
  

  onPublish: function () {

    let that = this;
    console.log('topic :' + that.data.shopid)
    wx.navigateTo({
      url: '../topicp/common?topicid=' + that.data.shopid,
    })

  },
   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },


  onDetail: function (e) {

    var that = this
    // 取得下标
    var index = parseInt(e.currentTarget.dataset.index)

    // 取出id值
    var objectId = that.data.results[index]._id

    console.log(",index:" + index + ", objectId :" + objectId)

    wx.navigateTo({
      url: '../comment/common?findid=' + objectId
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  

    var shopid

    if(options){
      shopid = options.topicid
    }
  
    console.log('shopid :' + shopid)

    const db = wx.cloud.database()

    let that = this;

    if(shopid){
    this.setData({
      shopid: shopid
    })
    }


    // 获取总数
    db.collection('find').count({
      success: function (res) {
        that.setData({

          totalCount: res.totalCount

        })

        console.log("count :" + that.data.totalCount)
      }
    })


    db.collection('find').orderBy('createTime', 'desc').where({
      topic_id: that.data.shopid
    }).limit(that.data.pageSize).get({

      success: function (res) {


        if (res.data) {

          for (var index in res.data) {

            var request_time = res.data[index].createTime;
            var oldTime = request_time / 1000;
            console.log('time :' + oldTime)
            var friendTime = timeUtils.formatTimeTwo(oldTime, 'M-D h:m');
            res.data[index].friendTime = friendTime;
          }
        }


        that.setData({

          results: res.data
        })
        console.log("res :" + JSON.stringify(res.data))
      }
    })



    db.collection('topic').where({
      topic_id: that.data.shopid
    }).get({

      success: function (res) {
        console.log('success')
        that.setData({

          carinfo: res.data[0]
        })

        wx.setNavigationBarTitle({

          title :that.data.carinfo.topic_name
        })
        // console.log('title :' + that.carinfo.topic_name)
        console.log('info :' + JSON.stringify(that.data.carinfo))
      },

      error: function (e) {

        console.log('error')
      }
    })
  },

  //加载更多
  onReachBottom: function (e) {

    console.log('onreachBootm' + this.data.results)

    var that = this;
    var temp = [];
    const db = wx.cloud.database()
    db.collection('find').orderBy('createTime', 'desc').skip(10 * this.data.mCurPage).where({
      topic_id: that.data.shopid
      }).get({

        success: function (res) {
     
         var page =  that.data.mCurPage + 1

         that.setData({
           mCurPage:page
         })

          for (var i = 0; i < res.data.length; i++) {
            var tempTopic = res.data[i];   
            temp.push(tempTopic);
          }

          var totalTopic = {};
          totalTopic = that.data.results.concat(temp);

          that.setData({

            results: totalTopic
          })
          console.log('info :' + JSON.stringify(that.data.products))
        },

        error: function (e) {

          console.log('error')
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;
    return {
      title: that.data.carinfo.topic_name,
      path: '/pages/car/logs?topic=' + that.data.shopid + "&share=2",
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