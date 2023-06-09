const path = require('path');
const isDev = think.env === 'development';
const kcors = require('kcors');

module.exports = [
  {
    handle: kcors, // 处理跨域
    options: {}
  },
  {
    handle: 'meta',
    options: {
      logRequest: isDev,
      sendResponseTime: isDev
    }
  },
  {
    handle: 'resource',
    enable: isDev,
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(static|favicon\.ico)/
    }
  },
  {
    handle: 'trace',
    enable: !think.isCli,
    options: {
      debug: isDev
    }
  },
  {
    handle: 'payload',
    options: {}
  },
  {
    handle: 'router',
    options: {
      defaultModule: 'api',
      defaultController: 'index',
      defaultAction: 'index'
    }
  },
  'logic',
  'controller'
];


/**
这段代码是一个中间件的配置文件，用于处理请求和响应。
它包含了一系列的处理程序，按照顺序依次执行。

首先，它使用 kcors 处理跨域请求。
[kcors 处理程序通过在响应头中添加一些特定的字段，告诉浏览器该请求是被允许的，从而解决了跨域请求的问题]
[具体来说，它会在响应头中添加 Access-Control-Allow-Origin 字段，指定允许的域名，以及其他一些相关的字段。 ]

然后，它使用 meta 处理程序记录请求日志和响应时间。
接下来，它使用 resource 处理程序提供静态资源服务。
如果 isDev 为真，则启用该处理程序。
然后，它使用 trace 处理程序记录请求和响应的详细信息。
如果不是命令行环境，则启用该处理程序。
接下来，它使用 payload 处理程序解析请求体。
最后，它使用 router 处理程序将请求路由到相应的控制器和操作。
如果没有指定控制器或操作，则使用默认值。
最后两个元素是字符串，表示逻辑处理程序和控制器处理程序。 

 */


