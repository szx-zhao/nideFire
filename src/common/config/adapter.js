const fileCache = require('think-cache-file');
const {Console, File, DateFile} = require('think-logger3');
const path = require('path');
const database = require('./database.js');

const isDev = think.env === 'development';

/**
 * cache adapter config
 * @type {Object}
 */
exports.cache = {
  type: 'file',
  common: {
    timeout: 24 * 60 * 60 * 1000 // millisecond
  },
  file: {
    handle: fileCache,
    cachePath: path.join(think.ROOT_PATH, 'runtime/cache'), // absoulte path is necessarily required
    pathDepth: 1,
    gcInterval: 24 * 60 * 60 * 1000 // gc interval
  }
};

/**
 * model adapter config
 * @type {Object}
 */
exports.model = {
  type: 'mysql',
  common: {
    logConnect: isDev,
    logSql: isDev,
    logger: msg => think.logger.info(msg)
  },
  mysql: database
};

/**
 * logger adapter config
 * @type {Object}
 */
exports.logger = {
  type: isDev ? 'console' : 'dateFile',
  console: {
    handle: Console
  },
  file: {
    handle: File,
    backups: 10, // max chunk number
    absolute: true,
    maxLogSize: 50 * 1024, // 50M
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  },
  dateFile: {
    handle: DateFile,
    level: 'ALL',
    absolute: true,
    pattern: '-yyyy-MM-dd',
    alwaysIncludePattern: true,
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  }
};

/**这段代码定义了三个适配器的配置：缓存适配器、模型适配器和日志适配器。
*缓存适配器使用文件作为缓存类型，设置了缓存超时时间、缓存路径、路径深度和垃圾回收间隔。
*模型适配器使用MySQL数据库，设置了连接日志、SQL日志和日志记录器。
*日志适配器根据开发环境选择控制台或日期文件类型，设置了备份数量、最大日志大小和日志文件路径。
*/

// 这些适配器的配置可以在应用程序中使用，以便根据需要进行缓存、数据库和日志操作。
// 适配器就是通过类适配器或对象适配器的形式,实现接口转换的一个辅助类。 