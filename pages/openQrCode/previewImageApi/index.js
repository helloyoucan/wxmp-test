// pages/openQrCode/previewImageApi/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    open(){
        wx.previewImage({
            current: '', // 当前显示图片的http链接
            urls: [
                "https://mmbiz.qpic.cn/mmbiz_jpg/icmGGQP5XRWES62uOHWxV7apkvDjKfzwXRKGeZNrGWJ5k15od93sXRf3rVy3zZDemeSvfAJ93rIicqTB874BA9bw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1",
                "https://mmbiz.qpic.cn/mmbiz_jpg/icmGGQP5XRWES62uOHWxV7apkvDjKfzwXPibSXQJImdIVytyebTuEia3eteQwqibODSicjA8V9XJb7lvT9mDFFMduXw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1",
                "https://mmbiz.qpic.cn/mmbiz_png/icmGGQP5XRWES62uOHWxV7apkvDjKfzwXsvGibDzPWQ5JdE4X4pY863IE4bTgVgOotemEnrOEKJQpXf6MMsJDlGQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1"
            ] // 需要预览的图片http链接列表
          })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.previewImage({
            current: '', // 当前显示图片的http链接
            urls: [
                "https://mmbiz.qpic.cn/mmbiz_jpg/icmGGQP5XRWES62uOHWxV7apkvDjKfzwXRKGeZNrGWJ5k15od93sXRf3rVy3zZDemeSvfAJ93rIicqTB874BA9bw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1",
                "https://mmbiz.qpic.cn/mmbiz_jpg/icmGGQP5XRWES62uOHWxV7apkvDjKfzwXPibSXQJImdIVytyebTuEia3eteQwqibODSicjA8V9XJb7lvT9mDFFMduXw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1",
                "https://mmbiz.qpic.cn/mmbiz_png/icmGGQP5XRWES62uOHWxV7apkvDjKfzwXsvGibDzPWQ5JdE4X4pY863IE4bTgVgOotemEnrOEKJQpXf6MMsJDlGQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1"
            ] // 需要预览的图片http链接列表
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

    }
})