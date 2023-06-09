const Application = require('thinkjs');
const babel = require('think-babel');
const watcher = require('think-watcher');
const notifier = require('node-notifier');

const instance = new Application({
  ROOT_PATH: __dirname,
  watcher: watcher,
  transpiler: [babel, {
    presets: ['think-node']
  }],
  notifier: notifier.notify.bind(notifier),
  env: 'development'
});

instance.run();

/** 
 * 创建一个ThinkJS应用程序实例，并在开发环境下运行它
 * 首先，它使用require语句引入了一些必要的模块，包括thinkjs、think-babel、think-watcher和node-notifier。
 * 然后，它创建了一个应用程序实例，并将一些配置选项传递给它。
 * 这些选项包括应用程序的根路径、监视器、转译器、通知器和环境。
 * 最后，它调用instance.run()方法来启动应用程序。
 * 如果你需要在开发环境下使用ThinkJS，这段代码就是一个很好的起点。 
 * 
*/