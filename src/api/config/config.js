// default config
//这些名称的格式都是控制器名称后跟斜杠和操作名称。这个模块的作用是提供一个配置文件，用于控制哪些控制器和操作可以被公开访问。 
module.exports = {
  // 可以公开访问的公共Controller
  publicController: [
    // 格式为controller
    //数组，包含可以公开访问的控制器名称，例如'index'和'catalog'
    'index',
    'catalog',
    'topic',
    'auth',
    'goods',
    'brand',
    'search',
    'region'
  ],

  // 可以公开访问的公共Action
  publicAction: [
    // 格式为： controller+action
    //数组，包含可以公开访问的控制器操作名称，例如'comment/list'和'cart/add'
    'comment/list',
    'comment/count',
    'cart/index',
    'cart/add',
    'cart/checked',
    'cart/update',
    'cart/delete',
    'cart/goodscount',
    'pay/notify'
  ]
};


