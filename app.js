//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.setStorageSync("_domianName", "http://localhost:64050");
    var _domianName = wx.getStorageSync("_domianName");
    var _that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: _domianName + '/WxOpenApi/WxOpenOAuthNew',
          method: "POST",
          data: { code: res.code },
          success: function (json) {
            var result = json.data;
            console.log("wx.login:", result);
            if (result.success) {
              wx.setStorageSync('sessionId', result.sessionId);//保存用户标识
          // 获取用户信息
          wx.getSetting({
            success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              _that.globalData.userInfo = res.userInfo;
              var sessionId = wx.getStorageSync('sessionId');
              var userInfoRes=res
              //校验并注册
              wx.request({
                url: _domianName + '/WxOpenApi/WxOpenCheck',
                method: 'POST',
                data: {
                  sessionId: sessionId,
                  rawData: userInfoRes.rawData,
                  signature: userInfoRes.signature,
                  iv: userInfoRes.iv,
                  encryptedData: userInfoRes.encryptedData
                },
                success: function (json) {
                  //保存用户标识和全局用户信息
                  if (json.data.success) {
                    _that.globalData.userInfo = json.data.msg;
                    wx.setStorageSync('userId', json.data.msg.UserId);
                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    if (_that.userInfoReadyCallback) {
                      _that.userInfoReadyCallback(res)
                    }
                  } else {
                    console.info("验证错误");

                  }

                }
              });
             
            }
          })
        }
      }
        })
            }
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null
  }
})