
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

  console.log('cookie :' + sessionid);

  console.log('csrftoken :' + csrftoken);

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

         
            wx.setStorageSync('sessionid', getSessionId2(res.header['Set-Cookie'])); //

            console.log('csrftoken :' + getSessionId(res.header['Set-Cookie']));
            wx.setStorageSync('csrftoken', getSessionId(res.header['Set-Cookie'])); //

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


function getSessionId(cookie) {
  var c_name = 'csrftoken';
  if (cookie.length > 0) {
    var c_start = cookie.indexOf(c_name + "=")
    var c_end;
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1
      c_end = cookie.indexOf(";", c_start)
      if (c_end == -1) c_end = cookie.length
      return unescape(cookie.substring(c_start, c_end));
    }
  }
}


function getSessionId2(cookie) {
  var c_name = 'sessionid';
  if (cookie.length > 0) {
    var c_start = cookie.indexOf(c_name + "=")
    var c_end;
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1
      c_end = cookie.indexOf(";", c_start)
      if (c_end == -1) c_end = cookie.length
      return unescape(cookie.substring(c_start, c_end));
    }
  }
}


module.exports = {
  Requests,
  Requests_json,
  getBaseUrl
}