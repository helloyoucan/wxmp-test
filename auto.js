const ci = require('miniprogram-ci');
; (async () => {
  const project = new ci.Project({
    appid: 'wxcd39857e98e1162d',
    type: 'miniProgram',
    projectPath: __dirname,
    privateKeyPath: 'privateKey/private.wxcd39857e98e1162d.key',
    ignores: ['node_modules/**/*'],
  })
  console.log(project)
  // const uploadResult = await ci.upload({
  //   project,
  //   version: '3.0.2',
  //   desc: '测试自动上传',
  //   setting: {
  //     es6: true,
  //     es7: true,
  //     minify: true,
  //     codeProtect: true,
  //     autoPrefixWXSS: true
  //   },
  //   onProgressUpdate: console.log,
  //   robot: 1 //开发者 ci机器人1
  // });

  // console.log(uploadResult)

})()