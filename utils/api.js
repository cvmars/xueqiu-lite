
function  getBaseUrl(){

  return 'https://test.lhxq.top';
}


function Requests(url, data) {


  var header = getHeader();

  return new Promise((resolv, reject) => {
    wx.request({
      url: url,
      data: data,
      method: "get",
      header: header,
      success: function(res) {
        if (res.data == "服务器异常") {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '网络错误或服务器繁忙!',
          })
        } else {
          console.log(res.data)
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



function getHeader() {


  let sessionid = wx.getStorageSync('sessionid');

  let csrftoken = wx.getStorageSync('csrftoken');

  let header = {
    'Content-Type': 'application/json',
  };
  if (sessionid) {
    header['Cookie'] = "csrftoken=" + csrftoken + ";sessionid=" + sessionid;
  }

  if (csrftoken) {
    header['X-CSRFToken'] = csrftoken;
  }
  return header;
}

function Requests_json(url, data) {

  var header = getHeader();

  return new Promise((resolv, reject) => {
    wx.request({
      url: url,
      data: data,
      method: "POST",
      header: header,
      success: function(res) {

          if (res && res.header && res.header['Set-Cookie']) {

         
            wx.setStorageSync('csrftoken', res.cookies[0].value);
            wx.setStorageSync('sessionid', res.cookies[1].value); 

          }

        if (res.data == "服务器异常") {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '网络错误或服务器繁忙!',
          })
        } else {

          console.log(res.data)
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
  Requests_json,
  getBaseUrl
}