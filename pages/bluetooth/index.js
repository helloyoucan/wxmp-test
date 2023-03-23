// pages/bluetooth/index.js
const app = getApp();
function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

Page({
  data: {
    devices: [],
    connected: false,
    chs: [],
  },
  openBluetoothAdapter() {
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('openBluetoothAdapter success', res)
        this.startBluetoothDevicesDiscovery()
      },
      fail: (res) => {
        if (res.errCode === 10001) {
          wx.onBluetoothAdapterStateChange(function (res) {
            console.log('onBluetoothAdapterStateChange', res)
            if (res.available) {
              this.startBluetoothDevicesDiscovery()
            }
          })
        }
      }
    })
  },
  getBluetoothAdapterState() {
    wx.getBluetoothAdapterState({
      success: (res) => {
        console.log('getBluetoothAdapterState', res)
        if (res.discovering) {
          this.onBluetoothDeviceFound()
        } else if (res.available) {
          this.startBluetoothDevicesDiscovery()
        }
      }
    })
  },
  startBluetoothDevicesDiscovery() {
    if (this._discoveryStarted) {
      return
    }
    this._discoveryStarted = true
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      success: (res) => {
        console.log('startBluetoothDevicesDiscovery success')
        this.onBluetoothDeviceFound()
      },
      fail: (res) => {
        console.log('startBluetoothDevicesDiscovery fail:',res)
        console.log('安卓可能会失败，注意开启蓝牙和定位权限后，重新进入该功能:')
      },
    })
  },
  stopBluetoothDevicesDiscovery() {
    console.log('执行stopBluetoothDevicesDiscovery')
    wx.stopBluetoothDevicesDiscovery({
      success: () => {
      },
      fail: () => {
      },
    })
  },
  onBluetoothDeviceFound() {
    wx.onBluetoothDeviceFound((res) => {
      res.devices.forEach(device => {
        if (!device.name && !device.localName) {
          return
        }
        const foundDevices = this.data.devices
        const idx = inArray(foundDevices, 'deviceId', device.deviceId)
        const data = {}
        if (idx === -1) {
          data[`devices[${foundDevices.length}]`] = device
        } else {
          data[`devices[${idx}]`] = device
        }
        this.setData(data)
      })
    })
  },
  createBLEConnection(e) {
    const ds = e.currentTarget.dataset
    const deviceId = ds.deviceId
    const name = ds.name
    console.log('开始连接' + deviceId)
    wx.createBLEConnection({
      deviceId,
      success: (res) => {
        console.log('连接' + deviceId + '成功', res)
        this.setData({
          connected: true,
          name,
          deviceId,
        })
        this.getBLEDeviceServices(deviceId)
      },
      fail: (e) => {
        console.log('连接' + deviceId + '失败');
      }
    })
    this.stopBluetoothDevicesDiscovery()
  },
  closeBLEConnection() {
    wx.closeBLEConnection({
      deviceId: this.data.deviceId
    })
    this.setData({
      connected: false,
      chs: [],
      canWrite: false,
    })
  },
  getBLEDeviceServices(deviceId) {

    wx.getBLEDeviceServices({
      deviceId,
      success: (res) => {
        console.log('services:', res.services)
        /** 
         * 16 位 UUID 从对接文档中获取（注意都是0000开头，接着的4位数字为16进制的uuid,所有服务只有4位uuid不一样）
         * 跳绳主服务 0000ff30-0000-1000-8000-00805f9b34fb （0xFF30）
         * 跳绳操作读写主服务 0000fd00-0000-1000-8000-00805f9b34fb （0xFD00）
         * 跳绳写数据的Characteristic 0000fd01-0000-1000-8000-00805f9b34fb （0xFD01）
         * 跳绳读取数据的Characteristic 0000fd02-0000-1000-8000-00805f9b34fb （0xFD02）
         * 跳绳读取数据的通知描述符 00002902-0000-1000-8000-00805f9b34fb （0x2902）
         */
        for (let i = 0; i < res.services.length; i++) {
          //  注意有多个服务，不同服务的操作不一样，单个服务只能执行单个操作，所以这里需要建立多个连接
          if (res.services[i].isPrimary) {
            this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid);
          }
        }
      }
    })
  },
  logData() {
    console.log(this.data.chs)
    console.log(this.data.devices)
    console.log({
      '_deviceId': this._deviceId,
      '_serviceId': this._serviceId,
      '_characteristicId': this._characteristicId
    })
  },
  getBLEDeviceCharacteristics(deviceId, serviceId) {
    wx.getBLEDeviceCharacteristics({
      deviceId,
      serviceId,
      success: (res) => {
        console.log('getBLEDeviceCharacteristics success：', serviceId)
        console.log(res.characteristics)
        for (let i = 0; i < res.characteristics.length; i++) {
          let item = res.characteristics[i]
          if (item.properties.read) {
            wx.readBLECharacteristicValue({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
            });
          }
          if (item.properties.write) {
            this.setData({
              canWrite: true
            })
            this._deviceId = deviceId
            this._serviceId = serviceId
            this._characteristicId = item.uuid
            this.writeBLECharacteristicValue()
          }
          if (item.properties.notify || item.properties.indicate) {
            wx.notifyBLECharacteristicValueChange({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
              state: true,
            })
          }
        }
      },
      fail(res) {
        console.error('getBLEDeviceCharacteristics', res)
      }
    })
    // 操作之前先监听，保证第一时间获取数据
    wx.onBLECharacteristicValueChange((characteristic) => {
      const idx = inArray(this.data.chs, 'uuid', characteristic.characteristicId)
      const data = {}
      if (idx === -1) {
        data[`chs[${this.data.chs.length}]`] = {
          uuid: characteristic.characteristicId,
          value: ab2hex(characteristic.value)
        }
      } else {
        data[`chs[${idx}]`] = {
          uuid: characteristic.characteristicId,
          value: ab2hex(characteristic.value)
        }
      }
      this.setData(data)
    })
  },
  writeBLECharacteristicValue() {
    function str2ab(str) {
      var buf = new ArrayBuffer(str.length);
      var bufView = new Uint8Array(buf);
      for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i)
      }
      return buf
    }
    var buffer = str2ab('*' + JSON.stringify({
      "an": "ba"
    }) + '#');//注意每次发送消息最多20个字节，超出了需要分段发送，接受消息也一样
    var param = {
      deviceId: this._deviceId,
      serviceId: this._serviceId,
      characteristicId: this._characteristicId,
      value: buffer
    }
    console.log(param);
    wx.writeBLECharacteristicValue({
      ...param,
      success: function (res) {
        console.log("发送指令成功");
        wx.showToast({
          title: '发送成功',
          icon: 'none'
        })
      },
      fail: function (res) {
        console.warn("发送指令失败", res)
      }
    })
  },
  // writeBLECharacteristicValue() {
  //   // 向蓝牙设备发送一个0x00的16进制数据
  //   let buffer = new ArrayBuffer(1)
  //   let dataView = new DataView(buffer)
  //   // dataView.setUint8(0, Math.random() * 255 | 0)
  //   dataView.setUint8(0, Math.random() * 255 | 0)
  //   wx.writeBLECharacteristicValue({
  //     deviceId: this._deviceId,
  //     serviceId: this._deviceId,
  //     characteristicId: this._characteristicId,
  //     value: buffer,
  //   })
  // },
  closeBluetoothAdapter() {
    wx.closeBluetoothAdapter()
    this._discoveryStarted = false
  },
})
