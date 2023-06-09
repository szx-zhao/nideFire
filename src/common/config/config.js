// default config
module.exports = {
  default_module: 'api',
  weixin: {
    appid: 'wxec40485765c92d85', // 小程序 appid
    secret: 'ffb64a31bfb553efff2b2ace01cf276e', // 小程序密钥
    mch_id: '', // 商用帐号ID
    partner_key: '', // 微信支付密钥
    notify_url: '' // 微信异步通知
  },
  express: {
    // 快递物流信息查询使用的是快递鸟接口，申请地址：http://www.kdniao.com/
    appid: '', // 对应快递鸟用户后台 用户ID
    appkey: '', // 对应快递鸟用户后台 API key
    request_url: 'http://api.kdniao.cc/Ebusiness/EbusinessOrderHandle.aspx'
  }
};

// 这段代码是一个JavaScript模块，导出了一个对象。
//该对象包含了一些默认配置信息，其中包括了微信小程序的appid和密钥，商用帐号ID和微信支付密钥等信息。
//此外，还包括了快递物流信息查询所需的快递鸟接口的用户ID和API key等信息。
//这些信息可以在其他模块中被引用和使用，以便在应用程序中进行微信小程序和快递物流信息查询等操作。 

//const config = require('../common/config/config.js');
// 现在你可以使用config对象中的属性了，例如：
//console.log(config.weixin.appid);