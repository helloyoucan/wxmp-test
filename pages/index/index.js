// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    // testParams:''
  },
  onLoad: function(options) {
    // this.setData({
    //   testParams: options.testParams,
    // })
    wx.login({
      success (res) {
        console.log(res)
      }})
  }
})
