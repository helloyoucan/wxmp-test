// pages/lanConnect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ip: '172.16.14.171',
    port: '8887',
    path:'/live',
    msg:'',
    logArr: [],
    SocketTask:null,
  },
  bindIpInput(e) {
    this.setData({
      ip: e.detail.value
    });
  },
  bindPortInput(e) {
    this.setData({
      port: e.detail.value
    });
  },
  bindPathInput(e) {
    this.setData({
      path: e.detail.value
    });
  },
  bindMsgInput(e) {
    this.setData({
      msg: e.detail.value
    });
  },
  addLog(log) {
    var logArr = this.data.logArr;
    logArr.unshift(log)
    this.setData({
      logArr: logArr
    });
  },
  disconnect(){
    this.data.SocketTask.close();
    this.setData({
      SocketTask:null
     });
  },
  connect() {
    var url = `ws://${this.data.ip}:${this.data.port}${this.data.path}`;
    this.addLog(`与${url}建立连接`)
    let SocketTask = wx.connectSocket({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      // protocols: [''],
      success: () => {},
      fail: () => {}
    });
    SocketTask.onOpen((result) => { 
      this.addLog(`**连接成功**`);
      this.setData({
        SocketTask:SocketTask
       });
     })
    SocketTask.onError((result) => { 
      console.log(result)
      this.addLog(`连接失败：`+result.errMsg);
     });
     SocketTask.onClose((result) => { 
      this.addLog(`连接已关闭`);
     });
     SocketTask.onMessage((result) => { 
      this.addLog(`收到消息：`+result);
     });
  },
  sendMsg(){
    if(this.data.SocketTask){
      this.addLog(`发送消息：`+ this.data.msg);
      this.data.SocketTask.send({data:this.data.msg});
    }else{
      this.addLog('未建立连接')
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.startLocalServiceDiscovery({
      // 当前手机所连的局域网下有一个 _http._tcp. 类型的服务
      serviceType: '_http._tcp.',
      success: console.log,
      fail: console.log
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})