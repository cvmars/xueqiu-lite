//logs.js
const util = require('../../utils/util.js')
const api = require('../../utils/api.js')
const API_PIAOLIU_LIST = '/bottles/picked/lists/'


Page({
  data: {
    result: []
  },
  onLoad: function() {
    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })
    this.getPiaoliuList();
  },

  getPiaoliuList: function(e) {



    api.Requests(api.getBaseUrl() + API_PIAOLIU_LIST)
      .then((res) => {

        if (res.data.results) {

          for (var index in res.data.results) {

            var request_time = res.data.results[index].create_at;
            var oldTime = (new Date(request_time)).getTime() / 1000;

            var friendTime = util.formatTimeTwo(oldTime, 'M/D h:m');
            res.data.results[index].friendTime = friendTime;
          }

        }
        this.setData({
          result: res.data.results
        })
      })
  }
})