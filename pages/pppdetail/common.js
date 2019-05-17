Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    carinfo:{},
    imgUrls: [
      'https://6c69-lianhua-82fcb3-1253553185.tcb.qcloud.la/ic_launcher.png',
      'https://6c69-lianhua-82fcb3-1253553185.tcb.qcloud.la/ic_launcher.png',
      'https://6c69-lianhua-82fcb3-1253553185.tcb.qcloud.la/ic_launcher.png',
      'https://6c69-lianhua-82fcb3-1253553185.tcb.qcloud.la/ic_launcher.png',
      'https://6c69-lianhua-82fcb3-1253553185.tcb.qcloud.la/ic_launcher.png'
    ],
    shopid:'',
    products:[],
    totalCount:100,
    pageSize:100
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var shopid = options.shopid
    console.log('shopid :' + shopid)

    const db = wx.cloud.database()

    let that = this;

    that.setData({
      shopid: shopid
    })

    db.collection('shop').where({
      shop_id: shopid
    }).get({

      success: function (res) {
        console.log('success')
        that.setData({

          carinfo: res.data[0]
        })
        console.log('info :' + JSON.stringify(that.data.carinfo))
      },

      error: function (e) {

        console.log('error')
      }

    })

    var temp = [];

    // 获取总数
    db.collection('product').count({
      success: function (res) {
        that.setData({


          totalCount: res.totalCount

        })

        console.log("count :" + that.data.totalCount)
      }
    })



    db.collection('product').where({
      shop_id: shopid
    }).limit(that.data.pageSize).get({

      success: function (res) {
        console.log('success')

        that.setData({

          products: res.data

        })
        console.log('info :' + JSON.stringify(that.data.products))
      },

      error: function (e) {

        console.log('error')
      }

    })
  },

  //加载更多
  onReachBottom:function(e){

    console.log('onreachBootm' + this.data.products.length + " " + this.data.totalCount)

    var that = this;
    var temp = [];

    if (this.data.products.length < this.data.totalCount) {

      db.collection('product').skip(20).where({
      shop_id: shopid
    }).get({

      success: function (res) {
        console.log('success')

        for (var i = 0; i < res.data.length; i++) {
          var tempTopic = res.data[i];
          console.log(tempTopic);
          temp.push(tempTopic);
        }
       
        var totalTopic = {};
        totalTopic = that.data.products.concat(temp);

        that.setData({

          products: totalTopic
        })
        console.log('info :' + JSON.stringify(that.data.products))
      },

      error: function (e) {

        console.log('error')
      }

    })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  /**
     * 用户点击右上角分享
     */

    onShareAppMessage: function () {
      let that = this;
      return {
       
        title: that.data.carinfo.shop_name,
        path: '/pages/car/logs?product=' + that.data.shopid+ "&share=3",
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
    },

  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },


  onCopy:function(){


    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: that.data.carinfo.shop_wx,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
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
    
  }
 
     /**
   * 用户点击右上角分享
   */

    
})