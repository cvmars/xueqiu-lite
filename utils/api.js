function Requests(url, data) {
  return new Promise((resolv, reject) => {
    wx.request({
      url: url,
      data: data,
      method: "get",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data == "服务器异常") {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '网络错误或服务器繁忙!',
          })
        } else {
          resolv(res.data)
        }
      },
      fail: function(err) {
        console.log(err)
        reject(err)
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '网络错误或服务器繁忙!',
        })
      }
    })
  })
}

function Requests_json(url, data) {
  return new Promise((resolv, reject) => {
    wx.request({
      url: url,
      data: data,
      method: "POST",
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        if (res.data == "服务器异常") {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '网络错误或服务器繁忙!',
          })
        } else {
          resolv(res.data)
        }
      },
      fail: function(err) {
        wx.hideLoading()
        console.log(err)
        reject(err)
        wx.showModal({
          title: '提示',
          content: '网络错误或服务器繁忙!',
        })
      }
    })
  })

}


module.exports = {
  Requests,
  Requests_json
}