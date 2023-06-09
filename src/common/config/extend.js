const model = require('think-model');
const cache = require('think-cache');

module.exports = [
  model(think.app),
  cache
];

//这段代码的作用是在应用程序中扩展模型和缓存。
//它首先使用 require 导入了 think-model 和 think-cache 模块。
//然后，它将这些模块作为参数传递给 module.exports，这是一个数组，其中包含了要扩展的模块。
//在这种情况下，它将 think.app 作为参数传递给 model 函数，以便在应用程序中创建一个模型实例。
//最后，它将 cache 模块添加到扩展列表中，以便在应用程序中启用缓存功能。 

//think-model 和 think-cache 是 ThinkJS 框架中的两个模块。
//think-model 模块用于创建和管理数据库模型，而 think-cache 模块用于启用缓存功能。
//在这段代码中，它们被用于扩展应用程序的功能。
//具体来说，model(think.app) 将 think.app 作为参数传递给 think-model 模块的函数，以便在应用程序中创建一个模型实例。
//而 cache 模块则被添加到扩展列表中，以便在应用程序中启用缓存功能。 

//think.app 模块是 ThinkJS 框架中的一个模块，它用于管理应用程序的配置和路由。
//在这段代码中，think.app 被作为参数传递给 model 函数，以便在应用程序中创建一个模型实例。
//同时，think-cache 模块被添加到扩展列表中，以便在应用程序中启用缓存功能。因此，这段代码的作用是在应用程序中扩展模型和缓存功能。 