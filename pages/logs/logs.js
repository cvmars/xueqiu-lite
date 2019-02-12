//logs.js
const util = require('../../utils/api.js')
const timeUtils = require('../../utils/util.js')
const API_LAST_PERSON = '/customer/active/lists/' //最近在线的人接口

Page({
  data: {
    results: [],
    times:[]
  },
  onLoad: function() {
  
    this.getLastPerson()
  },

  getLastPerson: function(e) {

    let that = this;
    let data = {}
    util.Requests(util.getBaseUrl() + API_LAST_PERSON, data)
      .then((res) => {
     
      
        console.log(this.data.results);

        for(var index in res.data.results){

          var request_time =  res.data.results[index].last_request_at;
          var oldTime = (new Date(request_time)).getTime() / 1000;

          var friendTime = timeUtils.formatTimeTwo(oldTime, 'M/D h:m');
        

          console.log('friendTime :' + friendTime)
          res.data.results[index].friendTime = friendTime;

          console.log('datatime :' + res.data.results[index].friendTime )
        }


        this.setData({
          results: res.data.results

        })

  

      })

  }


})